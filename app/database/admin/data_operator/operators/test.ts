// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {MM_TABLES} from '@constants/database';
import DataOperator from '@database/admin/data_operator/index';
import DatabaseManager from '@database/admin/database_manager';

// See LICENSE.txt for license information.
import {Q} from '@nozbe/watermelondb';
import App from '@typings/database/app';
import {DatabaseType, IsolatedEntities, OperationType} from '@typings/database/enums';

import {
    operateAppRecord,
    operateChannelMembershipRecord,
    operateCustomEmojiRecord,
    operateDraftRecord,
    operateFileRecord,
    operateGlobalRecord,
    operateGroupMembershipRecord,
    operatePostInThreadRecord,
    operatePostMetadataRecord,
    operatePostRecord,
    operatePostsInChannelRecord,
    operatePreferenceRecord,
    operateReactionRecord,
    operateRoleRecord,
    operateServersRecord,
    operateSystemRecord,
    operateTeamMembershipRecord,
    operateTermsOfServiceRecord,
    operateUserRecord,
} from './index';

jest.mock('@database/admin/database_manager');

const {APP} = MM_TABLES.DEFAULT;

/* eslint-disable  @typescript-eslint/no-explicit-any */

describe('*** DataOperator: Operators tests ***', () => {
    const createConnection = async (setActive = false) => {
        const dbName = 'server_schema_connection';
        const serverUrl = 'https://appv2.mattermost.com';
        const database = await DatabaseManager.createDatabaseConnection({
            shouldAddToDefaultDatabase: true,
            databaseConnection: {
                actionsEnabled: true,
                dbName,
                dbType: DatabaseType.SERVER,
                serverUrl,
            },
        });

        if (setActive) {
            await DatabaseManager.setActiveServerDatabase({
                displayName: dbName,
                serverUrl,
            });
        }

        return database;
    };

    it('=> operateAppRecord: should return an array of type App', async () => {
        expect.assertions(3);

        const database = await DatabaseManager.getDefaultDatabase();
        expect(database).toBeTruthy();

        const preparedRecords = await operateAppRecord({
            action: OperationType.CREATE,
            database: database!,
            value: {
                record: undefined,
                raw: {
                    buildNumber: 'build-7',
                    createdAt: 1,
                    id: 'id-18',
                    versionNumber: 'v-1',
                },
            },
        });

        expect(preparedRecords).toBeTruthy();
        expect(preparedRecords!.collection.modelClass.name).toMatch('App');
    });

    it('=> operateGlobalRecord: should return an array of type Global', async () => {
        expect.assertions(3);

        const database = await DatabaseManager.getDefaultDatabase();
        expect(database).toBeTruthy();

        const preparedRecords = await operateGlobalRecord({
            action: OperationType.CREATE,
            database: database!,
            value: {
                record: undefined,
                raw: {id: 'g-1', name: 'g-n1', value: 'g-v1'},
            },
        });

        expect(preparedRecords).toBeTruthy();
        expect(preparedRecords!.collection.modelClass.name).toMatch('Global');
    });

    it('=> operateServersRecord: should return an array of type Servers', async () => {
        expect.assertions(3);

        const database = await DatabaseManager.getDefaultDatabase();
        expect(database).toBeTruthy();

        const preparedRecords = await operateServersRecord({
            action: OperationType.CREATE,
            database: database!,
            value: {
                record: undefined,
                raw: {
                    dbPath: 'mm-server',
                    displayName: 's-displayName',
                    id: 's-1',
                    mentionCount: 1,
                    unreadCount: 0,
                    url: 'https://community.mattermost.com',
                },
            },
        });

        expect(preparedRecords).toBeTruthy();
        expect(preparedRecords!.collection.modelClass.name).toMatch('Servers');
    });

    it('=> operateRoleRecord: should return an array of type Role', async () => {
        expect.assertions(3);

        const database = await createConnection();
        expect(database).toBeTruthy();

        const preparedRecords = await operateRoleRecord({
            action: OperationType.CREATE,
            database: database!,
            value: {
                record: undefined,
                raw: {id: 'role-1', name: 'role-name-1', permissions: []},
            },
        });

        expect(preparedRecords).toBeTruthy();
        expect(preparedRecords!.collection.modelClass.name).toMatch('Role');
    });

    it('=> operateSystemRecord: should return an array of type System', async () => {
        expect.assertions(3);

        const database = await createConnection();
        expect(database).toBeTruthy();

        const preparedRecords = await operateSystemRecord({
            action: OperationType.CREATE,
            database: database!,
            value: {
                record: undefined,
                raw: {id: 'system-1', name: 'system-name-1', value: 'system'},
            },
        });

        expect(preparedRecords).toBeTruthy();
        expect(preparedRecords!.collection.modelClass.name).toMatch('System');
    });

    it('=> operateTermsOfServiceRecord: should return an array of type TermsOfService', async () => {
        expect.assertions(3);

        const database = await createConnection();
        expect(database).toBeTruthy();

        const preparedRecords = await operateTermsOfServiceRecord({
            action: OperationType.CREATE,
            database: database!,
            value: {
                record: undefined,
                raw: {
                    id: 'tos-1',
                    acceptedAt: 1,
                    create_at: 1613667352029,
                    user_id: 'user1613667352029',
                    text: '',
                },
            },
        });

        expect(preparedRecords).toBeTruthy();
        expect(preparedRecords!.collection.modelClass.name).toMatch(
            'TermsOfService',
        );
    });

    it('=> should create a record in the App table in the default database', async () => {
        expect.assertions(2);

        // Do a query and find out if the value has been registered in the App table of the default database
        const connection = await DatabaseManager.getDefaultDatabase();
        expect(connection).toBeTruthy();

        // Creates a record in the App table
        await DataOperator.handleIsolatedEntity({
            tableName: IsolatedEntities.APP,
            values: [
                {
                    buildNumber: 'build-1',
                    createdAt: 1,
                    id: 'id-1',
                    versionNumber: 'version-1',
                },
            ],
        });

        const records = (await connection!.collections.
            get(APP).
            query(Q.where('id', 'id-1')).
            fetch()) as App[];

        // We should expect to have a record returned as dictated by our query
        expect(records.length).toBe(1);
    });

    it('=> should create several records in the App table in the default database', async () => {
        expect.assertions(2);

        // Creates a record in the App table
        await DataOperator.handleIsolatedEntity({
            tableName: IsolatedEntities.APP,
            values: [
                {
                    buildNumber: 'build-10',
                    createdAt: 1,
                    id: 'id-10',
                    versionNumber: 'version-10',
                },
                {
                    buildNumber: 'build-11',
                    createdAt: 1,
                    id: 'id-11',
                    versionNumber: 'version-11',
                },
                {
                    buildNumber: 'build-12',
                    createdAt: 1,
                    id: 'id-12',
                    versionNumber: 'version-12',
                },
                {
                    buildNumber: 'build-13',
                    createdAt: 1,
                    id: 'id-13',
                    versionNumber: 'version-13',
                },
            ],
        });

        // Do a query and find out if the value has been registered in the App table of the default database
        const defaultDB = await DatabaseManager.getDefaultDatabase();
        expect(defaultDB).toBeTruthy();

        const records = (await defaultDB!.collections.
            get(APP).
            query(Q.where('id', Q.oneOf(['id-10', 'id-11', 'id-12', 'id-13']))).
            fetch()) as App[];

        // We should expect to have 4 records created
        expect(records.length).toBe(4);
    });

    it('=> should update a record in the App table in the default database', async () => {
        expect.assertions(3);

        const defaultDB = await DatabaseManager.getDefaultDatabase();
        expect(defaultDB).toBeTruthy();

        // Update record having id 'id-1'
        await DataOperator.handleIsolatedEntity({
            tableName: IsolatedEntities.APP,
            values: [
                {
                    buildNumber: 'build-13-13',
                    createdAt: 1,
                    id: 'id-1',
                    versionNumber: 'version-1',
                },
            ],
        });

        const records = (await defaultDB!.collections.
            get(APP).
            query(Q.where('id', 'id-1')).
            fetch()) as App[];
        expect(records.length).toBeGreaterThan(0);

        // Verify if the buildNumber for this record has been updated
        expect(records[0].buildNumber).toMatch('build-13-13');
    });

    it('=> should update several records in the App table in the default database', async () => {
        expect.assertions(4);

        const defaultDB = await DatabaseManager.getDefaultDatabase();
        expect(defaultDB).toBeTruthy();

        // Update records having id 'id-10' and 'id-11'
        await DataOperator.handleIsolatedEntity({
            tableName: IsolatedEntities.APP,
            values: [
                {
                    buildNumber: 'build-10x',
                    createdAt: 1,
                    id: 'id-10',
                    versionNumber: 'version-10',
                },
                {
                    buildNumber: 'build-11y',
                    createdAt: 1,
                    id: 'id-11',
                    versionNumber: 'version-11',
                },
            ],
        });

        const records = (await defaultDB!.collections.
            get(APP).
            query(Q.where('id', Q.oneOf(['id-10', 'id-11']))).
            fetch()) as App[];
        expect(records.length).toBe(2);

        // Verify if the buildNumber for those two record has been updated
        expect(records[0].buildNumber).toMatch('build-10x');
        expect(records[1].buildNumber).toMatch('build-11y');
    });

    it('=> [EDGE CASE] should UPDATE instead of CREATE record for existing id', async () => {
        expect.assertions(3);

        const defaultDB = await DatabaseManager.getDefaultDatabase();
        expect(defaultDB).toBeTruthy();

        await DataOperator.handleIsolatedEntity({
            tableName: IsolatedEntities.APP,
            values: [
                {
                    buildNumber: 'build-10x',
                    createdAt: 1,
                    id: 'id-10',
                    versionNumber: 'version-10',
                },
                {
                    buildNumber: 'build-11x',
                    createdAt: 1,
                    id: 'id-11',
                    versionNumber: 'version-11',
                },
            ],
        });

        const records = (await defaultDB!.collections.
            get(APP).
            query(Q.where('id', Q.oneOf(['id-10', 'id-11']))).
            fetch()) as App[];

        // Verify if the buildNumber for those two record has been updated
        expect(records[0].buildNumber).toMatch('build-10x');
        expect(records[1].buildNumber).toMatch('build-11x');
    });

    it('=> [EDGE CASE] should CREATE instead of UPDATE record for non-existing id', async () => {
        expect.assertions(3);

        const defaultDB = await DatabaseManager.getDefaultDatabase();
        expect(defaultDB).toBeTruthy();

        // id-15 and id-16 do not exist but yet the optType is UPDATE.  The operator should then prepareCreate the records instead of prepareUpdate
        await DataOperator.handleIsolatedEntity({
            tableName: IsolatedEntities.APP,
            values: [
                {
                    buildNumber: 'build-10x',
                    createdAt: 1,
                    id: 'id-15',
                    versionNumber: 'version-10',
                },
                {
                    buildNumber: 'build-11x',
                    createdAt: 1,
                    id: 'id-16',
                    versionNumber: 'version-11',
                },
            ],
        });

        const records = (await defaultDB!.collections.
            get(APP).
            query(Q.where('id', Q.oneOf(['id-15', 'id-16']))).
            fetch()) as App[];

        // Verify if the buildNumber for those two record has been created
        expect(records[0].buildNumber).toMatch('build-10x');
        expect(records[1].buildNumber).toMatch('build-11x');
    });

    it('=> operatePostRecord: should return an array of type Post', async () => {
        expect.assertions(3);

        const database = await createConnection();
        expect(database).toBeTruthy();

        const preparedRecords = await operatePostRecord({
            action: OperationType.CREATE,
            database: database!,
            value: {
                record: undefined,
                raw: {
                    id: '8swgtrrdiff89jnsiwiip3y1eoe',
                    create_at: 1596032651748,
                    update_at: 1596032651748,
                    edit_at: 0,
                    delete_at: 0,
                    is_pinned: false,
                    user_id: 'q3mzxua9zjfczqakxdkowc6u6yy',
                    channel_id: 'xxoq1p6bqg7dkxb3kj1mcjoungw',
                    root_id: 'ps81iqbesfby8jayz7owg4yypoo',
                    parent_id: 'ps81iqbddesfby8jayz7owg4yypoo',
                    original_id: '',
                    message: 'Testing operator post',
                    type: '',
                    props: {},
                    hashtags: '',
                    pending_post_id: '',
                    reply_count: 4,
                    last_reply_at: 0,
                    participants: null,
                    metadata: {},
                },
            },
        });

        expect(preparedRecords).toBeTruthy();
        expect(preparedRecords!.collection.modelClass.name).toMatch('Post');
    });

    it('=> operatePostInThreadRecord: should return an array of type PostsInThread', async () => {
        expect.assertions(3);

        const database = await createConnection();
        expect(database).toBeTruthy();

        const preparedRecords = await operatePostInThreadRecord({
            action: OperationType.CREATE,
            database: database!,
            value: {
                record: undefined,
                raw: {
                    id: 'ps81iqbddesfby8jayz7owg4yypoo',
                    post_id: '8swgtrrdiff89jnsiwiip3y1eoe',
                    earliest: 1596032651748,
                    latest: 1597032651748,
                },
            },
        });

        expect(preparedRecords).toBeTruthy();
        expect(preparedRecords!.collection.modelClass.name).toMatch(
            'PostsInThread',
        );
    });

    it('=> operateReactionRecord: should return an array of type Reaction', async () => {
        expect.assertions(3);

        const database = await createConnection();
        expect(database).toBeTruthy();

        const preparedRecords = await operateReactionRecord({
            action: OperationType.CREATE,
            database: database!,
            value: {
                record: undefined,
                raw: {
                    id: 'ps81iqbddesfby8jayz7owg4yypoo',
                    user_id: 'q3mzxua9zjfczqakxdkowc6u6yy',
                    post_id: 'ps81iqbddesfby8jayz7owg4yypoo',
                    emoji_name: 'thumbsup',
                    create_at: 1596032651748,
                    update_at: 1608253011321,
                    delete_at: 0,
                },
            },
        });

        expect(preparedRecords).toBeTruthy();
        expect(preparedRecords!.collection.modelClass.name).toMatch('Reaction');
    });

    it('=> operateFileRecord: should return an array of type File', async () => {
        expect.assertions(3);

        const database = await createConnection();
        expect(database).toBeTruthy();

        const preparedRecords = await operateFileRecord({
            action: OperationType.CREATE,
            database: database!,
            value: {
                record: undefined,
                raw: {
                    post_id: 'ps81iqbddesfby8jayz7owg4yypoo',
                    name: 'test_file',
                    extension: '.jpg',
                    size: 1000,
                    create_at: 1609253011321,
                    delete_at: 1609253011321,
                    height: 20,
                    update_at: 1609253011321,
                    user_id: 'wqyby5r5pinxxdqhoaomtacdhc',
                },
            },
        });

        expect(preparedRecords).toBeTruthy();
        expect(preparedRecords!.collection.modelClass.name).toMatch('File');
    });

    it('=> operatePostMetadataRecord: should return an array of type PostMetadata', async () => {
        expect.assertions(3);

        const database = await createConnection();
        expect(database).toBeTruthy();

        const preparedRecords = await operatePostMetadataRecord({
            action: OperationType.CREATE,
            database: database!,
            value: {
                record: undefined,
                raw: {
                    id: 'ps81i4yypoo',
                    data: {},
                    postId: 'ps81iqbddesfby8jayz7owg4yypoo',
                    type: 'opengraph',
                },
            },
        });

        expect(preparedRecords).toBeTruthy();
        expect(preparedRecords!.collection.modelClass.name).toMatch('PostMetadata');
    });

    it('=> operateDraftRecord: should return an array of type Draft', async () => {
        expect.assertions(3);

        const database = await createConnection();
        expect(database).toBeTruthy();

        const preparedRecords = await operateDraftRecord({
            action: OperationType.CREATE,
            database: database!,
            value: {
                record: undefined,
                raw: {
                    id: 'ps81i4yypoo',
                    root_id: 'ps81iqbddesfby8jayz7owg4yypoo',
                    message: 'draft message',
                    channel_id: 'channel_idp23232e',
                    files: [],
                },
            },
        });

        expect(preparedRecords).toBeTruthy();
        expect(preparedRecords!.collection.modelClass.name).toMatch('Draft');
    });

    it('=> operatePostsInChannelRecord: should return an array of type PostsInChannel', async () => {
        expect.assertions(3);

        const database = await createConnection();
        expect(database).toBeTruthy();

        const preparedRecords = await operatePostsInChannelRecord({
            action: OperationType.CREATE,
            database: database!,
            value: {
                record: undefined,
                raw: {
                    id: 'ps81i4yypoo',
                    channel_id: 'channel_idp23232e',
                    earliest: 1608253011321,
                    latest: 1609253011321,
                },
            },
        });

        expect(preparedRecords).toBeTruthy();
        expect(preparedRecords!.collection.modelClass.name).toMatch(
            'PostsInChannel',
        );
    });

    it('=> operateUserRecord: should return an array of type User', async () => {
        expect.assertions(3);

        const database = await createConnection();
        expect(database).toBeTruthy();

        const preparedRecords = await operateUserRecord({
            action: OperationType.CREATE,
            database: database!,
            value: {
                record: undefined,
                raw: {
                    id: '9ciscaqbrpd6d8s68k76xb9bte',
                    create_at: 1599457495881,
                    update_at: 1607683720173,
                    delete_at: 0,
                    username: 'a.l',
                    auth_service: 'saml',
                    email: 'a.l@mattermost.com',
                    email_verified: true,
                    nickname: '',
                    first_name: 'A',
                    last_name: 'L',
                    position: 'Mobile Engineer',
                    roles: 'system_user',
                    props: {},
                    notify_props: {
                        desktop: 'all',
                        desktop_sound: true,
                        email: true,
                        first_name: true,
                        mention_keys: '',
                        push: 'mention',
                        channel: true,

                        auto_responder_active: false,
                        auto_responder_message: 'Hello, I am out of office and unable to respond to messages.',
                        comments: 'never',
                        desktop_notification_sound: 'Hello',
                        push_status: 'online',
                    },
                    last_password_update: 1604323112537,
                    last_picture_update: 1604686302260,
                    locale: 'en',
                    timezone: {
                        automaticTimezone: 'Indian/Mauritius',
                        manualTimezone: '',
                        useAutomaticTimezone: true,
                    },
                },
            },
        });

        expect(preparedRecords).toBeTruthy();
        expect(preparedRecords!.collection.modelClass.name).toMatch('User');
    });

    it('=> operatePreferenceRecord: should return an array of type Preference', async () => {
        expect.assertions(3);

        const database = await createConnection();
        expect(database).toBeTruthy();

        const preparedRecords = await operatePreferenceRecord({
            action: OperationType.CREATE,
            database: database!,
            value: {
                record: undefined,
                raw: {user_id: '9ciscaqbrpd6d8s68k76xb9bte', category: 'tutorial_step', name: '9ciscaqbrpd6d8s68k76xb9bte', value: '2'},
            },
        });

        expect(preparedRecords).toBeTruthy();
        expect(preparedRecords!.collection.modelClass.name).toMatch('Preference');
    });

    it('=> operatePreferenceRecord: should return an array of type TEAM_MEMBERSHIP', async () => {
        expect.assertions(3);

        const database = await createConnection();
        expect(database).toBeTruthy();

        const preparedRecords = await operateTeamMembershipRecord({
            action: OperationType.CREATE,
            database: database!,
            value: {
                record: undefined,
                raw: {
                    team_id: 'a',
                    user_id: 'ab',
                    roles: '3ngdqe1e7tfcbmam4qgnxp91bw',
                    delete_at: 0,
                    scheme_guest: false,
                    scheme_user: true,
                    scheme_admin: false,
                    explicit_roles: '',
                },
            },
        });

        expect(preparedRecords).toBeTruthy();
        expect(preparedRecords!.collection.modelClass.name).toMatch('TeamMembership');
    });

    it('=> operateCustomEmojiRecord: should return an array of type CustomEmoji', async () => {
        expect.assertions(3);

        const database = await createConnection();
        expect(database).toBeTruthy();

        const preparedRecords = await operateCustomEmojiRecord({
            action: OperationType.CREATE,
            database: database!,
            value: {
                record: undefined,
                raw: {
                    id: 'i',
                    create_at: 1580913641769,
                    update_at: 1580913641769,
                    delete_at: 0,
                    creator_id: '4cprpki7ri81mbx8efixcsb8jo',
                    name: 'boomI',
                },
            },
        });

        expect(preparedRecords).toBeTruthy();
        expect(preparedRecords!.collection.modelClass.name).toMatch('CustomEmoji');
    });

    it('=> operateGroupMembershipRecord: should return an array of type GroupMembership', async () => {
        expect.assertions(3);

        const database = await createConnection();
        expect(database).toBeTruthy();

        const preparedRecords = await operateGroupMembershipRecord({
            action: OperationType.CREATE,
            database: database!,
            value: {
                record: undefined,
                raw: {
                    user_id: 'u4cprpki7ri81mbx8efixcsb8jo',
                    group_id: 'g4cprpki7ri81mbx8efixcsb8jo',

                },
            },
        });

        expect(preparedRecords).toBeTruthy();
        expect(preparedRecords!.collection.modelClass.name).toMatch('GroupMembership');
    });

    it('=> operateChannelMembershipRecord: should return an array of type ChannelMembership', async () => {
        expect.assertions(3);

        const database = await createConnection();
        expect(database).toBeTruthy();

        const preparedRecords = await operateChannelMembershipRecord({
            action: OperationType.CREATE,
            database: database!,
            value: {
                record: undefined,
                raw: {
                    channel_id: '17bfnb1uwb8epewp4q3x3rx9go',
                    user_id: '9ciscaqbrpd6d8s68k76xb9bte',
                    roles: 'wqyby5r5pinxxdqhoaomtacdhc',
                    last_viewed_at: 1613667352029,
                    msg_count: 3864,
                    mention_count: 0,
                    notify_props: {
                        desktop: 'default',
                        email: 'default',
                        ignore_channel_mentions: 'default',
                        mark_unread: 'mention',
                        push: 'default',
                    },
                    last_update_at: 1613667352029,
                    scheme_guest: false,
                    scheme_user: true,
                    scheme_admin: false,
                    explicit_roles: '',
                },
            },
        });

        expect(preparedRecords).toBeTruthy();
        expect(preparedRecords!.collection.modelClass.name).toMatch('ChannelMembership');
    });
});
