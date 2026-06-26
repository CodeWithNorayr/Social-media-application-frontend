import React, { useContext, useEffect, useState } from 'react';
import "./Post.css";
import {
  ImageIcon,
  SendHorizontal,
  Trash,
  Heart,
  User,
  Pencil
} from 'lucide-react';
import assets from '../../assets/assets';
import { StoreContext } from '../../Context/AuthContext/AuthContext';
import axios from 'axios';
import { toast } from "react-toastify";
import Navbar from '../../Components/Navbar/Navbar';

const Post = () => {
  const { backendURL, token, userData } = useContext(StoreContext);

  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  // EDIT
  const [editingPostId, setEditingPostId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState(null);

  const slides = [assets.shamcom, assets.share, assets.post];

  // ================= FETCH POSTS =================
  const fetchingAllPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${backendURL}/api/post/fetching/posts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setPosts(res.data.posts || []);
      } else {
        setPosts([]);
      }

    } catch (err) {
      console.log(err);
      toast.error("Error fetching posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchingAllPosts();
  }, [token]);

  // ================= LIKE =================
  const likeToggling = async (postId) => {
    try {
      const res = await axios.post(
        `${backendURL}/api/post/toggling/post/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setPosts(prev =>
          prev.map(p =>
            p._id === postId
              ? { ...p, likes: res.data.likes || p.likes }
              : p
          )
        );
      }

    } catch (err) {
      console.log(err);
      toast.error("Like error");
    }
  };

  // ================= CREATE POST =================
  const createPost = async (e) => {
    e.preventDefault();

    if (!text && !image) {
      return toast.warn("Add something!");
    }

    try {
      const formData = new FormData();
      if (text) formData.append("text", text);
      if (image) formData.append("image", image);

      const res = await axios.post(
        `${backendURL}/api/post/create/post`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Posted!");

        setPosts(prev => [res.data.post, ...prev]);

        setText('');
        setImage(null);
        setImagePreview(null);
      }

    } catch (err) {
      console.log(err);
      toast.error("Create failed");
    }
  };

  // ================= DELETE =================
  const deleteUserPost = async (id) => {
    try {
      const res = await axios.delete(
        `${backendURL}/api/post/delete/post/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setPosts(prev => prev.filter(p => p._id !== id));
        toast.success("Deleted");
      }

    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  // ================= EDIT =================
  const startEditing = (post) => {
    setEditingPostId(post._id);
    setEditText(post.text || "");
    setEditPreview(post.image || null);
  };

  const cancelEditing = () => {
    setEditingPostId(null);
    setEditText("");
    setEditImage(null);
    setEditPreview(null);
  };

  const editUserPost = async (id) => {
    try {
      const formData = new FormData();
      if (editText) formData.append("text", editText);
      if (editImage) formData.append("image", editImage);

      const res = await axios.put(
        `${backendURL}/api/post/update/post/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setPosts(prev =>
          prev.map(p =>
            p._id === id
              ? {
                  ...p,
                  text: editText || p.text,
                  image: editPreview || p.image
                }
              : p
          )
        );

        toast.success("Updated");
        cancelEditing();
      }

    } catch (err) {
      console.log(err);
      toast.error("Update failed");
    }
  };

  // ================= SLIDER =================
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // ================= IMAGE HANDLERS =================
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setEditImage(file);
    setEditPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (editPreview) URL.revokeObjectURL(editPreview);
    };
  }, [imagePreview, editPreview]);

  return (
    <div>
      <Navbar />

      <div className='post-section-full'>
        <main className='post-wrapper'>

          {/* CREATE */}
          <form onSubmit={createPost} className='form-section'>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind?"
            />

            {imagePreview && <img src={imagePreview} alt="" />}

            <div className='post-image-button-section'>
              <label htmlFor="image"><ImageIcon /></label>
              <input id="image" type="file" hidden onChange={handleImageChange} />

              <button type="submit"><SendHorizontal /></button>
            </div>
          </form>

          {/* POSTS */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            posts.map(post => (
              <div key={post._id} className='post-card'>

                <div className='post-header'>
                  {post.user?.image ? (
                    <img src={post.user.image} className="post-user-image" />
                  ) : (
                    <User />
                  )}
                  <h4>{post.user?.name}</h4>
                </div>

                {/* EDIT MODE */}
                {editingPostId === post._id ? (
                  <div>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    {editPreview && <img src={editPreview} alt="" />}
                    <input type="file" onChange={handleEditImageChange} />

                    <button onClick={() => editUserPost(post._id)}>Save</button>
                    <button onClick={cancelEditing}>Cancel</button>
                  </div>
                ) : (
                  <>
                    {post.text && <p>{post.text}</p>}
                    {post.image && <img src={post.image} alt="" />}
                  </>
                )}

                {/* ACTIONS */}
                <div className='post-actions'>
                  <Heart onClick={() => likeToggling(post._id)} />

                  {String(userData?._id) === String(post?.user?._id) && (
                    <>
                      <Trash onClick={() => deleteUserPost(post._id)} />
                      <Pencil onClick={() => startEditing(post)} />
                    </>
                  )}
                </div>

              </div>
            ))
          )}

        </main>

        {/* SLIDER */}
        <aside className='post-aside-section'>
          <img src={slides[slideIndex]} alt="" />
        </aside>

      </div>
    </div>
  );
};

export default Post;
