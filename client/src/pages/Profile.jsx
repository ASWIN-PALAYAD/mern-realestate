import { useSelector } from "react-redux";
import { useRef } from 'react';
import { useState, useEffect } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";
import { updateUserStart,updateUserSuccess,updateUserFail, deleteUserStart, deleteUserFail, deleteUserSuccess, signOutUserStart, signOutUserSuccess, signOutUserFail } from "../redux/slices/user/userSlice.js";
import { useDispatch } from "react-redux";
import axios from "axios";

const Profile = () => {

  const fileRef = useRef(null);
  const dispatch = useDispatch();

  const { currentUser,loading,error } = useSelector(state => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false)


  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress))
      },

      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadURL) => {
            setFormData({ ...formData, avatar: downloadURL })
          }
        )
      }
    );

  }

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file])

  const handleChange = (e) => {
    setFormData({...formData,[e.target.id] : e.target.value})
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart())
      const {data} = await axios.post(`/api/user/update/${currentUser?._id}`,{...formData});
      if(data?.success === false){
        dispatch(updateUserFail(data?.message));
        return
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFail(error.response.data.message))
    }
  }

  const handleDeleteUser = async() => {
    try {
      dispatch(deleteUserStart());
      const {data} = await axios.delete(`/api/user/delete/${currentUser._id}`);
      if(data?.success === false) {
        dispatch(deleteUserFail(data?.message));
        return;
      }
      dispatch(deleteUserSuccess(data))

    } catch (error) {
      dispatch(deleteUserFail(error.response.data.message))
    }
  }

  const handleSignout = async() => {
    try {
      dispatch(signOutUserStart())
      const {data} = await axios.get('/api/auth/signout');
      if(data?.success === false){
        dispatch(signOutUserFail(data?.message));
        return;
      }
      dispatch(signOutUserSuccess(data))
      
    } catch (error) {
      dispatch(signOutUserFail(error?.response.data.message));

    }
  }
 

  return (
    <div className="p-3 max-w-lg mx-auto" onSubmit={handleSubmit}>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className="flex flex-col gap-4">
        <input type="file" ref={fileRef} hidden accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        <img src={formData.avatar || currentUser?.avatar} alt="profile" onClick={() => fileRef.current.click()} className="rounded-full w-24 h-24 object-cover cursor-pointer 
          self-center mt-2" />
        <p className="text-sm self-center">
          {fileUploadError ?
            <span className="text-red-700">Error file upload (image must be less than 2 mb)</span> :
            filePerc > 0 && filePerc < 100 ? (
              <span className="text-slate-700">{`Uploading ${filePerc} %`}</span>) :
              filePerc === 100 ? (
                <span className="text-green-700">Image successfully uploaded</span>
              ) : ' '
          }
        </p>
        <input type="text" id="username" placeholder="username" defaultValue={currentUser?.username}
        onChange={handleChange}
        className="border p-3 rounded-lg" />
        <input type="email" id="email" placeholder="email" defaultValue={currentUser?.email}
        onChange={handleChange}
        className="border p-3 rounded-lg" />
        <input type="password" id="password" placeholder="password"
        onChange={handleChange}
        className="border p-3 rounded-lg" />
        
         <p className="text-red-700 mt-5 text-center" >{error ? error : ""}</p>

        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        disabled={loading} 
        >
          {loading ? 'loading...' : 'update'}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer font-bold">Delete account</span>
        <span onClick={handleSignout} className="text-red-700 cursor-pointer font-bold">Sign out</span>
      </div>
      <p className="text-green-700 mt-5 text-center" >{updateSuccess ? "Successfully updated" : ''}</p>
    </div>
  )
}

export default Profile