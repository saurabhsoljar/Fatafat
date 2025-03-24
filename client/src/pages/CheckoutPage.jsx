import React, { useState, useEffect } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'

const CheckoutPage = () => {
    const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext()
    const [openAddress, setOpenAddress] = useState(false)
    const addressList = useSelector(state => state.addresses.addressList)
    const [selectedAddressId, setSelectedAddressId] = useState('')
    const cartItemsList = useSelector(state => state.cartItem.cart)
    const navigate = useNavigate()

    // Filter active addresses
    const activeAddresses = addressList.filter(address => address.status)

    // Auto-select first address when addresses load
    useEffect(() => {
        if(activeAddresses.length > 0 && !selectedAddressId) {
            setSelectedAddressId(activeAddresses[0]._id)
        }
    }, [activeAddresses])

    const validateAddress = () => {
        if(!selectedAddressId) {
            toast.error("Please select a delivery address")
            return false
        }
        if(!activeAddresses.find(address => address._id === selectedAddressId)) {
            toast.error("Selected address is not valid")
            return false
        }
        return true
    }

    const handleCashOnDelivery = async() => {
        if(!validateAddress()) return
        
        try {
            const response = await Axios({
                ...SummaryApi.CashOnDeliveryOrder,
                data : {
                    list_items : cartItemsList,
                    addressId : selectedAddressId,
                    subTotalAmt : totalPrice,
                    totalAmt :  totalPrice,
                }
            })

            const { data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                fetchCartItem?.()
                fetchOrder?.()
                navigate('/success', { state : { text : "Order" } })
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    const handleOnlinePayment = async() => {
        if(!validateAddress()) return
        
        try {
            toast.loading("Processing payment...")
            const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
            const stripePromise = await loadStripe(stripePublicKey)
        
            const response = await Axios({
                ...SummaryApi.payment_url,
                data : {
                    list_items : cartItemsList,
                    addressId : selectedAddressId,
                    subTotalAmt : totalPrice,
                    totalAmt :  totalPrice,
                }
            })
            
        const { data : responseData } = response
        stripePromise.redirectToCheckout({ sessionId : responseData.id })
            
            fetchCartItem?.()
            fetchOrder?.()
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='bg-blue-50 mt-20'>
            <div className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between'>
                {/* Address Section */}
                <div className='w-full'>
                    <h3 className='text-lg font-semibold mb-4'>Choose your address</h3>
                    <div className='bg-white p-4 rounded-lg shadow-sm'>
                        {activeAddresses.map((address) => (
                            <div 
                                key={address._id}
                                className={`border rounded-lg p-4 mb-3 cursor-pointer transition-all
                                    ${selectedAddressId === address._id 
                                        ? 'border-2 border-blue-500 bg-blue-50' 
                                        : 'hover:border-blue-200'}`}
                                onClick={() => setSelectedAddressId(address._id)}
                            >
                                <div className='flex items-start gap-3'>
                                    <input 
                                        type="radio"
                                        checked={selectedAddressId === address._id}
                                        readOnly
                                        className='mt-1'
                                    />
                                    <div className='flex-1'>
                                        <p className='font-medium'>{address.address_line}</p>
                                        <p className='text-gray-600'>{address.city}, {address.state}</p>
                                        <p className='text-gray-600'>{address.country} - {address.pincode}</p>
                                        <p className='mt-2 text-gray-600'>Phone: {address.mobile}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add New Address Button */}
                        <div
                            className='border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-blue-300 transition-colors'
                            onClick={() => setOpenAddress(true)}
                        >
                            <span className='text-blue-600'>+ Add New Address</span>
                        </div>
                    </div>
                </div>

                {/* Payment Summary Section */}
                <div className='w-full max-w-md bg-white p-4 rounded-lg shadow-sm'>
                    <h3 className='text-lg font-semibold mb-4'>Order Summary</h3>
                    <div className='space-y-3'>
                        <div className='flex justify-between'>
                            <span>Items ({totalQty}):</span>
                            <span>{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                        </div>
                        
                        {(notDiscountTotalPrice - totalPrice) > 0 && (
                            <div className='flex justify-between text-green-600'>
                                <span>Discount:</span>
                                <span>-{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}</span>
                            </div>
                        )}

                        <div className='flex justify-between'>
                            <span>Delivery Charges:</span>
                            <span>FREE</span>
                        </div>

                        <div className='border-t pt-3 mt-3'>
                            <div className='flex justify-between font-semibold'>
                                <span>Total Amount:</span>
                                <span>{DisplayPriceInRupees(totalPrice)}</span>
                            </div>
                        </div>
                    </div>

                    <div className='mt-6 space-y-3'>
                        <button 
                            onClick={handleOnlinePayment}
                            className='w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors'
                        >
                            Proceed to Online Payment
                        </button>
                        
                        <button
                            onClick={handleCashOnDelivery}
                            className='w-full border-2 border-green-600 text-green-600 hover:bg-green-50 py-2 px-4 rounded transition-colors'
                        >
                            Cash on Delivery
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Address Modal */}
            {openAddress && (
                <AddAddress 
                    close={() => setOpenAddress(false)}
                    onNewAddressAdded={(newAddress) => {
                        if(newAddress.status) {
                            setSelectedAddressId(newAddress._id)
                        }
                    }}
                />
            )}
        </section>
    )
}

export default CheckoutPage