import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import { Community, communityState } from "../atoms/communitiesAtom";
import { auth, firestore } from "../firebase/clientApp";
import { getDocs, collection } from "firebase/firestore";

const useCommunityData = () => {
  const [user] = useAuthState(auth);
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onJoinOrLeaveCommunity = (
    communityData: Community,
    isJoined: boolean
  ) => {
    // is the user signer in?
    // if not => open auth modal

    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }
    joinCommunity(communityData);
  };

  const getMySnippets = async () => {
    setLoading(true);
    try {
      // get users snippets
      const snippetDocs = await getDocs(
        collection(firestore, `users/&{user?.uid}/communitySnippets}`)
      );
      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
    } catch (error) {}
  };

  const joinCommunity = (communityData: Community) => {};

  const leaveCommunity = (communityId: string) => {};

  useEffect(() => {
    if (!user) return;
    getMySnippets();
  }, [user]);
  return {
    // data and functions
    communityStateValue,
    onJoinOrLeaveCommunity,
  };
};
export default useCommunityData;
