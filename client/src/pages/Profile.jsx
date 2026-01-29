import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);

  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const data = new FormData();
    data.append("avatar", file);

    try {
      setFileUploadError(false);
      setFilePerc(50);

      const res = await fetch('/api/user/upload-avatar', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();

      if (!result.success) {
        setFileUploadError(true);
        return;
      }

      setFormData({ ...formData, avatar: result.avatar });
      setFilePerc(100);
    } catch (error) {
      setFileUploadError(true);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form className='flex flex-col gap-4'>
        <input
          type='file'
          hidden
          ref={fileRef}
          accept='image/*'
          onChange={(e) => setFile(e.target.files[0])}
        />

        <img
          src={formData.avatar || currentUser.avatar}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
          onClick={() => fileRef.current.click()}
        />

        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Image upload failed (max 2MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>Uploading {filePerc}%</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>
              Image uploaded successfully
            </span>
          ) : (
            ''
          )}
        </p>

        <input type='text' placeholder='username' className='border p-3 rounded-lg' />
        <input type='email' placeholder='email' className='border p-3 rounded-lg' />
        <input type='password' placeholder='password' className='border p-3 rounded-lg' />

        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase'>
          update
        </button>
      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
    </div>
  );
}
