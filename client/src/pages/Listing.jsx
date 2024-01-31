import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {Swiper,SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules';
import 'swiper/css/bundle';

const Listing = () => {

    SwiperCore.use([Navigation]);
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    console.log(listing);



    useEffect(()=>{
        const fetchingData = async()=> {

            try {
                setError(false);
                setLoading(true);
                const {data} = await axios.get(`/api/listing/getSingleListing/${params.listingId}`);
            if(data.success === false){
                setError(true);
                setLoading(false);
                return
            }
            setListing(data);
            setLoading(false);
            setError(false);
                
            } catch (error) {
                setError(true)
                setLoading(false);
            }

            
            
        }
        fetchingData();
    },[params.listingId])

  return (
    <main>
        {loading && <p className='text-center my-7'>Loading...</p> }
        {error && <p className='text-center my-7 text-red-700'>Something went wrong</p> }

        {listing && !loading && !error && (
            <>
                <Swiper navigation>
                    {listing?.imageUrl?.map((url)=>(
                        <SwiperSlide key={url}>
                            <div className='h-[500px]' style={{background:`url(${url}) center no-repeat`, backgroundSize:'cover'}}>

                            </div>
                        </SwiperSlide>
                    ))}

                </Swiper>
            </>
        )}
    </main>
  )
}

export default Listing