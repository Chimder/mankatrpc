import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";

export interface tagSlice {
  genresTag: string[];
  langTag: string;
  statusTag: string;
  sortTag: string;
  inputValue: string;
  sortName: string;
  sortValue: string;
}

const initialState: tagSlice = {
  genresTag: [],
  langTag: "",
  statusTag: "",
  sortTag: "",
  inputValue: "",
  sortName: "",
  sortValue: "",
};

export const tagSlice = createSlice({
  name: "Tags",
  initialState,
  reducers: {
    setGenresTag(state, { payload }: PayloadAction<string>) {
      const include = state.genresTag!.includes(payload);
      if (include) {
        state.genresTag = state.genresTag!.filter((tag) => tag !== payload);
      } else {
        state.genresTag!.push(payload);
      }
    },
    setLangTag(state, { payload }: PayloadAction<string>) {
      const currentTag = state.langTag;
      const newTag = payload;

      state.langTag = !currentTag || currentTag !== newTag ? newTag : "";
    },
    setStatus(state, { payload }: PayloadAction<string>) {
      const currentTag = state.statusTag;
      const newTag = payload;

      state.statusTag = !currentTag || currentTag !== newTag ? newTag : "";
    },
    setSort(state, { payload }: PayloadAction<string>) {
      const currentTag = state.sortTag;
      const newTag = payload;

      state.sortTag = !currentTag || currentTag !== newTag ? newTag : "";
      if (payload === "Latest upload") {
        state.sortName = "published";
        state.sortValue = "desc";
      } else if (payload === "Oldest upload") {
        state.sortName = "published";
        state.sortValue = "asc";
      } else if (payload === "Title Ascending") {
        state.sortName = "name";
        state.sortValue = "asc";
      } else if (payload === "Title Descending") {
        state.sortName = "name";
        state.sortValue = "desc";
      } else if (payload === "Highest Rating") {
        state.sortName = "averageRating";
        state.sortValue = "desc";
      } else if (payload === "Lowest Rating") {
        state.sortName = "averageRating";
        state.sortValue = "asc";
      } else {
        state.sortName = "";
        state.sortValue = "";
      }
    },
    resetTag(state) {
      state.genresTag = [];
      state.langTag = "";
      state.sortTag = "";
      state.statusTag = "";
      state.inputValue = "";
    },
    setInputValue(state, action: PayloadAction<string>) {
      state.inputValue = action.payload;
    },
  },
});

export const {
  setGenresTag,
  setLangTag,
  setSort,
  setStatus,
  resetTag,
  setInputValue,
} = tagSlice.actions;

export default tagSlice.reducer;
