// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {combineReducers} from 'redux';

import {AppsTypes} from '@mm-redux/action_types';
import {AppBinding, AppsState} from '@mm-redux/types/apps';
import {GenericAction} from '@mm-redux/types/actions';

function bindings(state: AppBinding[] = [], action: GenericAction): AppBinding[] {
    switch (action.type) {
    case AppsTypes.RECEIVED_APP_BINDINGS: {
        return action.data || [];
    }
    default:
        return state;
    }
}

export default (combineReducers({
    bindings,
}) as (b: AppsState, a: GenericAction) => AppsState);
