import { QueryCache, QueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any, query) => {
      if (query.state.data !== undefined) {
        toast.error(`Something went wrong: ${error.message}`);
      }
    },
  }),
});
