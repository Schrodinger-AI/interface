import { messageUnreadCount } from 'api/request';
import { setUnreadMessagesCount } from 'redux/reducer/info';
import { dispatch } from 'redux/store';

export const getMessageUnreadCount = async (address: string) => {
  try {
    const res = await messageUnreadCount({
      address,
    });
    dispatch(setUnreadMessagesCount(res.count));
  } catch (error) {
    dispatch(setUnreadMessagesCount(0));
  }
};
