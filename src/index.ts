#!/usr/bin/env node

import { program } from 'commander';
import bs58 from 'bs58';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Keypair, PublicKey, Connection, clusterApiUrl, Cluster, Transaction } from '@solana/web3.js';
import { getMultipleAccounts, sendSignedTransaction, loadMetadata, readPrivateKey } from './utils';
import { Data } from './metaplex/classes';
import { getMetadataAddress } from './metaplex/utils';
import { createMetadata, updateMetadataInstruction } from './metaplex/metadata';

const RPC_CLUSTER_SERUM = 'https://solana-api.projectserum.com';
// const RPC_CLUSTER_DEV = 'https://api.devnet.solana.com';
const RPC_CLUSTER = RPC_CLUSTER_SERUM;

const getConnection = (env: string) => {
    const cluster = env === 'mainnet-beta' ? RPC_CLUSTER : clusterApiUrl(env as Cluster);
    const connection = new Connection(cluster);
    return connection;
};

program.version('0.0.1');

program
    .command('update')
    .option('-e, --env <string>', 'Solana cluster env name. One of: mainnet-beta, testnet, devnet', 'devnet')
    // .option('-k, --keypair <path>', 'Solana wallet location', '--keypair not provided')
    .action(async (_directory, cmd) => {
        try {
            const { env } = cmd.opts();

            const connection = getConnection(env);

            const decoded = bs58.decode(readPrivateKey());

            const walletKeyPair = Keypair.fromSecretKey(decoded);

            const metaKey: PublicKey[] = await Promise.all(
                cmd.args.map((key: string) => getMetadataAddress(new PublicKey(key))),
            );

            const rawMetas = await getMultipleAccounts(
                connection,
                metaKey.map((e: PublicKey) => e.toBase58()),
                'finalized',
            );

            // if not found, add instruction create account
            for (let index = 0; index < rawMetas.keys.length; index++) {
                const instructions = [];

                const metaKey = rawMetas.keys[index];
                const metaAccount = rawMetas.array[index];
                if (!metaAccount) {
                    console.log('if not found, add instruction create account');
                }

                const mintKey = cmd.args[index];
                console.log(`mintKey = ${mintKey}`);
                console.log(`metaKey = ${metaKey}`);

                const updatedData = new Data(loadMetadata());

                instructions.push(
                    await updateMetadataInstruction(
                        updatedData,
                        walletKeyPair.publicKey.toBase58(), // newUpdateAuthority
                        true,
                        mintKey,
                        walletKeyPair.publicKey.toBase58(), // updateAuthority
                        // metadataAccountStr,
                    ),
                );
                // console.log('instruction', instruction);
                const tx = new Transaction().add(...instructions);

                tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
                tx.feePayer = walletKeyPair.publicKey;

                tx.sign(walletKeyPair, walletKeyPair);
                // console.log('tx', tx);

                const { txid, slot } = await sendSignedTransaction({
                    connection,
                    signedTransaction: tx,
                });

                console.log('✅ Tx was successful! ID: ', txid, slot);
            }
        } catch (error) {
            console.warn(`🚫 failed to set with error:`, error.message);
        }
    });

program
    .command('set')
    .option('-e, --env <string>', 'Solana cluster env name. One of: mainnet-beta, testnet, devnet', 'devnet')
    // .option('-k, --keypair <path>', 'Solana wallet location', '--keypair not provided')
    .action(async (_directory, cmd) => {
        try {
            const { env } = cmd.opts();

            const connection = getConnection(env);

            const decoded = bs58.decode(readPrivateKey());

            const walletKeyPair = Keypair.fromSecretKey(decoded);

            const metaKey: PublicKey[] = await Promise.all(
                cmd.args.map((key: string) => getMetadataAddress(new PublicKey(key))),
            );

            const rawMetas = await getMultipleAccounts(
                connection,
                metaKey.map((e: PublicKey) => e.toBase58()),
                'finalized',
            );

            // if not found, add instruction create account
            for (let index = 0; index < rawMetas.keys.length; index++) {
                const instructions = [];

                const metaKey = rawMetas.keys[index];
                const metaAccount = rawMetas.array[index];
                if (!metaAccount) {
                    console.log('if not found, add instruction create account');
                }

                const mintKey = cmd.args[index];
                console.log(`mintKey = ${mintKey}`);
                console.log(`metaKey = ${metaKey}`);

                const updatedData = new Data(loadMetadata());

                instructions.push(
                    await createMetadata(
                        updatedData,
                        walletKeyPair.publicKey.toBase58(), // newUpdateAuthority
                        mintKey,
                        null, // updateAuthority walletKeyPair.publicKey.toBase58(), // updateAuthority
                        walletKeyPair.publicKey.toBase58(),
                    ),
                );

                // console.log('instruction', instruction);
                const tx = new Transaction().add(...instructions);

                tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
                tx.feePayer = walletKeyPair.publicKey;

                tx.sign(walletKeyPair, walletKeyPair);
                // console.log('tx', tx);

                const { txid, slot } = await sendSignedTransaction({
                    connection,
                    signedTransaction: tx,
                });

                console.log('✅ Tx was successful! ID: ', txid, slot);
            }
        } catch (error) {
            console.warn(`🚫 failed to set with error:`, error.message);
        }
    });

program
.command('lock')
.option('-e, --env <string>', 'Solana cluster env name. One of: mainnet-beta, testnet, devnet', 'devnet')
// .option('-k, --keypair <path>', 'Solana wallet location', '--keypair not provided')
.action(async (_directory, cmd) => {
    try {
        const { env } = cmd.opts();

        const connection = getConnection(env);

        const decoded = bs58.decode(readPrivateKey());

        const walletKeyPair = Keypair.fromSecretKey(decoded);

        // if not found, add instruction create account
        for (let index = 0; index < cmd.args.length; index++) {
            const tokenMint = new PublicKey(cmd.args[index]);
            const token = new Token(connection, tokenMint, TOKEN_PROGRAM_ID, walletKeyPair);
            const txid = await token.setAuthority(tokenMint, null, 'MintTokens', walletKeyPair.publicKey, [walletKeyPair])
            console.log('✅ Tx was successful! ID: ', txid);
        }
    } catch (error) {
        console.warn(`🚫 failed to set with error:`, error.message);
    }
});

program.parse(process.argv);



// import { Connection, clusterApiUrl, Keypair, PublicKey } from '@solana/web3.js'

// (async () => {
//   const connection = new Connection(clusterApiUrl('mainnet-beta'))

//   const bytes = bs58.decode(process.env.PRIVATE_KEY)
//   const account = Keypair.fromSecretKey(bytes)

//   const tokenMint = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')


// })()