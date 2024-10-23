import { useEffect, useState } from 'react';
import { useVerifyEmail } from '@/lib/react-query/queriesAndMutations';
import { useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import AppLogo from '@/components/shared/AppLogo';
import { Message } from 'primereact/message';
import { Skeleton } from 'primereact/skeleton';

const VerifyEmail = () => {
  const { token, uniqueId, email } = useParams();
  const { mutateAsync: verifyEmail, isPending: isVerifying } = useVerifyEmail();
  const [displayMessage, setDisplayMessage] = useState('');
  const [displayMessageState, setDisplayMessageState] = useState(false);


  useEffect(() => {
    const verifyUserEmail = async () => {
      if (token && uniqueId && email) {
        try {
          const result = await verifyEmail({ token, uniqueId, email });
          if (result?.data?.status == "success") {
            setDisplayMessageState(true);
            setDisplayMessage(result.data.data?.message);
          } else {
            setDisplayMessageState(false);
            setDisplayMessage(result.response.data.message.message);
          }
        } catch (error) {
          setDisplayMessageState(false);
          //@ts-ignore
          setDisplayMessage(error?.message);
        }
      }
    };
    verifyUserEmail();
  }, [token, uniqueId, verifyEmail]); // Added dependencies

  return (
    <>
      <div className='flex justify-center items-center w-full bg-main-bg-900 flex-col'>
        <div className="flex align-middle text-center items-center justify-center mb-10">
          <AppLogo />
        </div>
        {isVerifying ? (
          <Card className='w-[560px] shadow-lg p-4'>
            <h1 className=" font-inter font-bold text-main-bg-900 mb-6 text-md ml-2">Email Verification</h1> {/* Text */}
            <Skeleton width="520px" height='100px'></Skeleton>
          </Card>
        ) : (
          <Card className='w-[560px] shadow-lg p-4'>
            <h1 className=" font-inter font-bold text-main-bg-900 mb-6 text-md ml-2">Email Verification</h1> {/* Text */}
            <Message
              style={{
                border: `solid ${displayMessageState ? '#0': ''}`,
                borderWidth: '0 0 0 6px',
                color: '#000C79'
              }}
              className="border-primary w-full justify-content-start text-left displayMessage block"
              severity={displayMessageState ? 'info' : 'error'}
              content={displayMessage}
            />
          </Card>
        )}
      </div>
    </>

  );
};

export default VerifyEmail;
