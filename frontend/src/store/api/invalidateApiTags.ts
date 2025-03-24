import type { Dispatch } from "@reduxjs/toolkit";
import { authStatusTag, characterTag, userTag } from "./tags";

const invalidateApiTags = (tag: string[]) => {
  return async (
    _arg: unknown,
    {
      dispatch,
      queryFulfilled,
    }: { dispatch: Dispatch; queryFulfilled: Promise<unknown> },
  ) => {
    try {
      await queryFulfilled;
      for (const t of tag) {
        switch (t) {
          case characterTag:
            dispatch(
              (
                await import("./characterApiSlice")
              ).characterApiSlice.util.invalidateTags([characterTag]),
            );
            break;
          case userTag:
            dispatch(
              (await import("./userApiSlice")).userApiSlice.util.invalidateTags(
                [userTag],
              ),
            );
            break;
          case authStatusTag:
            dispatch(
              (await import("./userApiSlice")).userApiSlice.util.invalidateTags(
                [authStatusTag],
              ),
            );
        }
      }
    } catch (error) {
      console.error("Error invalidating tags", error);
    }
  };
};

export default invalidateApiTags;
