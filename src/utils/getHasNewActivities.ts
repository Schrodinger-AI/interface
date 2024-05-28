import { activityList } from 'api/request';
import { setHasNewActivities } from 'redux/reducer/info';
import { dispatch } from 'redux/store';

export const getHasNewActivities = async () => {
  try {
    const res = await activityList({
      skipCount: 0,
      maxResultCount: 10,
    });
    dispatch(setHasNewActivities(res.hasNewActivity));
  } catch (error) {
    dispatch(setHasNewActivities(false));
  }
};
