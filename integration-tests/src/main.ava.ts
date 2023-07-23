import { Worker, NEAR, NearAccount } from 'near-workspaces';
import anyTest, { TestFn } from 'ava';
import { PostedMessage } from '../../contract/src/model';

const test = anyTest as TestFn<{
  worker: Worker;
  accounts: Record<string, NearAccount>;
}>;

test.beforeEach(async (t) => {
  // Init the worker and start a Sandbox server
  const worker = await Worker.init();

  // deploy contract
  const root = worker.rootAccount;

  // some test accounts
  const alice = await root.createSubAccount('alice', {
    initialBalance: NEAR.parse('30 N').toJSON(),
  });
  const contract = await root.createSubAccount('contract', {
    initialBalance: NEAR.parse('30 N').toJSON(),
  });

  // Get wasm file path from package.json test script in folder above
  await contract.deploy(process.argv[2]);

  // Save state for test runs, it is unique for each test
  t.context.worker = worker;
  t.context.accounts = { root, contract, alice };
});

test.afterEach(async (t) => {
  // Stop Sandbox server
  await t.context.worker.tearDown().catch((error) => {
    console.log('Failed to stop the Sandbox:', error);
  });
});

test('send one message and retrieve it', async (t) => {
  const { root, contract } = t.context.accounts;

  await root.call(contract, 'add_message', {
    text: 'aloha',
    topic: '#hey',
    donation: '0',
  });
  const messages = (await contract.view('get_messages')) as PostedMessage[];

  t.is(messages.length, 1);
  t.is(messages[0].premium, false);
  t.is(messages[0].sender, root.accountId);
  t.is(messages[0].text, 'aloha');
  t.is(messages[0].topic, '#hey');
  t.is(messages[0].donation, '0');
  t.true(typeof messages[0].time === 'bigint');
});

test('send two messages and expect two total', async (t) => {
  const { root, contract, alice } = t.context.accounts;
  await root.call(contract, 'add_message', {
    text: 'aloha',
    topic: '#hey',
    donation: '0',
  });
  await alice.call(
    contract,
    'add_message',
    { text: 'hola', topic: '#hola', donation: '1' },
    { attachedDeposit: NEAR.parse('1') },
  );

  const total_messages = await contract.view('total_messages');
  t.is(total_messages, 2);

  const messages = (await contract.view('get_messages')) as PostedMessage[];

  t.is(messages.length, 2);
  t.is(messages[0].premium, false);
  t.is(messages[0].sender, root.accountId);
  t.is(messages[0].text, 'aloha');
  t.is(messages[0].topic, '');
  t.is(messages[0].donation, '');
  t.true(typeof messages[0].time === 'bigint');

  t.is(messages[1].premium, true);
  t.is(messages[1].sender, alice.accountId);
  t.is(messages[1].text, 'hola');
  t.is(messages[1].topic, '');
  t.is(messages[1].donation, '');
  t.true(typeof messages[1].time === 'bigint');
});
