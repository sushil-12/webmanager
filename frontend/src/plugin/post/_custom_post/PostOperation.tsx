import PostForm from "@/plugin/post/_custom_form/PostForm";
import Header from "@/components/ui/header";
import { useParams } from "react-router-dom";
import { formatString } from "@/lib/utils";
import { useState, useEffect } from "react";
import { PostModel } from "@/lib/types";
import { usegetPostbyID } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthProvider";
import Loader from "@/components/shared/Loader";

const PostOperation = () => {
  const { post_type, post_id, domain } = useParams();
  const { setCurrentDomain } = useUserContext();
  // @ts-ignore
  setCurrentDomain(atob(domain))
  const [post, setPost] = useState<PostModel | null>(null);
  const { mutateAsync: getPostByID, isPending: isPostLoading } = usegetPostbyID();



  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (post_id) {
          const response = await getPostByID(post_id);
          setPost(response?.data?.post);
        }
      } catch (error) {
        // Handle error
      }
    };

    fetchPost();
  }, [getPostByID, post_id, post_type]);

  const formattedPostType = post_type ? formatString(post_type) : "";
  return (
    <>
      {post_type ? (
        <div className="common-container h-100">
          <Header title={`Manage ${formattedPostType}`} />
          {isPostLoading ?<div className="w-full h-[70vh] flex items-center justify-center"><Loader type="main" /></div> : (
            post_id ? (post && <PostForm post_type={post_type} post={post} />) : <PostForm post_type={post_type} post={post} />)}
        </div>
      ) : (
        <div className=""></div>
      )}
    </>
  );
};

export default PostOperation;
