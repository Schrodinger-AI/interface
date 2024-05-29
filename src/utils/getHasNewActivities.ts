import { activityInfo } from 'api/request';
import { setHasNewActivities } from 'redux/reducer/info';
import { dispatch } from 'redux/store';

export const getHasNewActivities = async () => {
  try {
    const res = await activityInfo();
    dispatch(setHasNewActivities(res.hasNewActivity));
  } catch (error) {
    dispatch(setHasNewActivities(false));
  }
};
