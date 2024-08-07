import { useEffect } from "react";
import React, { useState } from "react";
import Form from "./Form";
import Posts from "./Posts";

export default function App() {
  const [post, setPost] = useState({
    title: "",
    content: "",
  });

  const [postArr, setpostArr] = useState([
    {
      title: "",
      content: "",
      img: "",
    },
  ]);

  function updatePost(e) {
    const { name, value } = e.target;

    setPost((prev) => {
      if (name == "title") {
        return {
          title: value,
          content: prev.content,
        };
      } else {
        return {
          title: prev.title,
          content: value,
        };
      }
    });
  }

  const addPost = async (e) => {
    console.log(postArr);
    e.preventDefault();

    try {
      const response = await fetch(
        "https://ogimage-bakcend.onrender.com/generate-og-image",
        {
          method: "POST",
          mode: 'no-cors',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: post.title,
            content: post.content,
          }),
        }
      );

      if (response.ok) {
        const ans = await response.json();
        const ogImageUrl = ans.imageUrl;

        const metaTag = document.createElement("meta");
        metaTag.setAttribute("property", "og:image");
        metaTag.setAttribute("content", ogImageUrl);
        document.head.appendChild(metaTag);

        setpostArr((prev) => {
          if (postArr[0].title == "") {
            return [
              {
                title: post.title,
                content: post.content,
                img: ogImageUrl,
              },
            ];
          }

          const arr = [
            ...prev,
            {
              title: post.title,
              content: post.content,
              img: ogImageUrl,
            },
          ];

          setPost({
            title: "",
            content: "",
          });
          return arr;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Form addPost={addPost} updatePost={updatePost} post={post} />
      {postArr[0].title != "" && <Posts postArr={postArr} />}
    </div>
  );
}
