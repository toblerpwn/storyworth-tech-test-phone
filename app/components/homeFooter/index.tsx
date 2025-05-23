"use client";

import Spinner from "@/app/components/ui/spinner";
import {
  useCurrentUserCallSid,
  useCurrentUserId,
} from "@/app/hooks/useCurrentUser";
import { removeActiveCall } from "@/app/utils/firestore";

export const HomeFooter = () => {
  const currentUserId = useCurrentUserId();
  const currentCallSid = useCurrentUserCallSid();

  const handleDeleteCall = async () => {
    if (!currentUserId) {
      console.error("No user ID found");
      return;
    } else if (!currentCallSid) {
      console.error("No active call to delete");
      return;
    }

    try {
      await removeActiveCall(currentUserId);
    } catch (error) {
      console.error("Error deleting call:", error);
    }
  };

  return (
    <div className="row-start-3 gap-[24px] flex-wrap items-center justify-center">
      {currentUserId ? (
        <div className="flex flex-row gap-3 font-text text-sm">
          <p>Signed in as: {currentUserId.slice(0, 5)}...</p>
          <p>|</p>
          {currentCallSid ? (
            <>
              <p>Current call SID: {currentCallSid.slice(0, 7)}...</p>
              <button
                className="underline text-gray-500 hover:text-gray-700 px-0 py-0 bg-transparent border-none shadow-none"
                style={{ fontWeight: 400, fontSize: "inherit" }}
                onClick={handleDeleteCall}
              >
                (Delete Call)
              </button>
            </>
          ) : (
            <p>(No active call)</p>
          )}
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default HomeFooter;
