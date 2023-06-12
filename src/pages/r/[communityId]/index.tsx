import { Community, communityState } from "@/src/atoms/communitiesAtom";
import About from "@/src/components/Community/About";
import CreatePostLink from "@/src/components/Community/CreatePostLink";
import Header from "@/src/components/Community/Header";
import NotFound from "@/src/components/Community/NotFound";
import PageContent from "@/src/components/Layout/PageContent";
import Posts from "@/src/components/Posts/Posts";
import { firestore } from "@/src/firebase/clientApp";
import { doc, getDocFromServer } from "firebase/firestore";
import { GetServerSidePropsContext, NextPage } from "next";
import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import safeJsonStringify from "safe-json-stringify";

type CommunityPageProps = {
  communityData: Community;
};

const CommunityPage: NextPage<any> = ({ communityData, communityDocRef, communityDoc, err }) => {
  const setCommunityStateValue = useSetRecoilState(communityState);
  console.log(err, 'err')
  useEffect(() => {
    console.log(err, 'err')
    console.log(communityDoc, 'communityDoc')
    console.log(communityDocRef, 'communityDocRef')
    setCommunityStateValue((prev) => ({
      ...prev,
      currentCommunity: communityData,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityData]);

  if (!communityData) {
    return <NotFound />;
  }

  return (
    <>
      <Header communityData={communityData} />
      <PageContent>
        <>
          <CreatePostLink />
          <Posts communityData={communityData} />
        </>
        <>
          <About communityData={communityData} />
        </>
      </PageContent>
    </>
  );
};
export default CommunityPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // get community data and pass it to client
  try {
    let communityDocRef = doc(
      firestore,
      "communities",
      context.query.communityId as string
    );


    let communityDoc = null;
    let err;
    try {
      communityDoc =  await getDocFromServer(communityDocRef);
    } catch(e) {
      err = e;
      console.log(e, 'eeeeeeee')
    }

    return {
      props: {
        communityData: communityDoc?.exists()
          ? JSON.parse(
              safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
            )
          : "",
          communityDocRef: JSON.stringify(communityDocRef),
          communityDoc: JSON.stringify(communityDoc),
          err: err || null,
      },
    };
    // return {
    //   props: {
    //     communityData: "",
    //     communityDocRef,
    //   },
    // };
  } catch (error) {
    // Could add error page here.
    console.log("getServerSideProps error", error);
  }
}
