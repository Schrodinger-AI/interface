import { createSlice } from '@reduxjs/toolkit';
import { AppState } from 'redux/store';
import { HYDRATE } from 'next-redux-wrapper';
import { TCustomThemeType, CustomThemeType } from 'redux/types/reducerTypes';

const initialState: TCustomThemeType = {
  layoutBackground: 'bg-neutralWhiteBg',
  hideHeaderMenu: false,
  headerTheme: CustomThemeType.light,
  footerTheme: CustomThemeType.light,
};

// Actual Slice
export const customThemeSlice = createSlice({
  name: 'customTheme',
  initialState,
  reducers: {
    setCustomTheme(state, action) {
      state = {
        ...state,
        ...action.payload,
      };
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { setCustomTheme } = customThemeSlice.actions;
export const getCustomTheme = (state: AppState) => state;

export default customThemeSlice.reducer;
