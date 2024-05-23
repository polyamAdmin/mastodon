import { apiReblog, apiUnreblog } from 'flavours/polyam/api/interactions';
import type { StatusVisibility } from 'flavours/polyam/models/status';
import { createDataLoadingThunk } from 'flavours/polyam/store/typed_functions';

import { importFetchedStatus } from './importer';

export const reblog = createDataLoadingThunk(
  'status/reblog',
  (statusId: string, visibility: StatusVisibility) =>
    apiReblog(statusId, visibility),
  (data, { dispatch, discardLoadData }) => {
    // The reblog API method returns a new status wrapped around the original. In this case we are only
    // interested in how the original is modified, hence passing it skipping the wrapper
    dispatch(importFetchedStatus(data.reblog));

    // The payload is not used in any actions
    return discardLoadData;
  },
);

export const unreblog = createDataLoadingThunk(
  'status/unreblog',
  (statusId: string) => apiUnreblog(statusId),
  (data, { dispatch, discardLoadData }) => {
    dispatch(importFetchedStatus(data));

    // The payload is not used in any actions
    return discardLoadData;
  },
);
