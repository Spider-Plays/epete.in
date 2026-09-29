import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks";
import { useAuth } from "../hooks/authStore";
import { formatPrice } from "../utils";

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { 
    items, 
    totalItems, 
    totalPrice,
    isLoading,
    error,
    clearCart
  } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">You need to be logged in to checkout</p>
          <a
            href="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Login to Continue
          </a>
        </div>
      </div>
    );
  }
  
  // Check if cart is empty
  if (isLoading || !items || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Your cart is empty</p>
          <a href="/shop" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }
  
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax (simplified)
  const shipping = 0; // Free shipping (simplified)
  const total = subtotal + tax + shipping;
  
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  });
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  
  const handlePrevious = () => setStep(step - 1);
  const handleNext = () => setStep(step + 1);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validate shipping info
      if (!shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
        alert("Please fill in all required shipping fields");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Validate payment info
      if (!paymentMethod) {
        alert("Please select a payment method");
        return;
      }
      
      // In a real app, you would process the payment here
      // For now, we'll simulate a successful payment
      try {
        // TODO: Integrate with actual payment processor (Stripe, Razorpay, etc.)
        // const paymentResult = await processPayment({ /* payment data */ });
        
        // Simulate successful payment
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Clear cart and show confirmation
        clearCart();
        setStep(3);
      } catch (error) {
        alert("Payment processing failed. Please try again.");
        console.error("Payment error:", error);
      }
    } else if (step === 3) {
      // Reset and go to home
      setStep(1);
      navigate("/shop", { replace: true });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md">
        {/* Step Indicator */}
        <div className="flex flex-col lg:flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 text-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 1 ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}>
                1
              </div>
              <p className="mt-2 text-sm font-medium text-gray-600">
                Shipping
              </p>
            </div>
            
            <div className="w-4">
              <svg className="h-4 w-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14" />
              </svg>
            </div>
            
            <div className="flex-1 text-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 2 ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}>
                2
              </div>
              <p className="mt-2 text-sm font-medium text-gray-600">
                Payment
              </p>
            </div>
            
            <div className="w-4">
              <svg className="h-4 w-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14" />
              </svg>
            </div>
            
            <div className="flex-1 text-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 3 ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}>
                3
              </div>
              <p className="mt-2 text-sm font-medium text-gray-600">
                Confirmation
              </p>
            </div>
          </div>
        </div>
        
        {/* Step Content */}
        <div className="p-6">
          {step === 1 && (
            <ShippingStep
              shippingAddress={shippingAddress}
              setShippingAddress={setShippingAddress}
              items={items}
              subtotal={subtotal}
              tax={tax}
              shipping={shipping}
              total={total}
            />
          )}
          
          {step === 2 && (
            <PaymentStep
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              total={total}
            />
          )}
          
          {step === 3 && (
            <ConfirmationStep
              onSubmit={handleSubmit}
              navigate={navigate}
            />
          )}
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          {step > 1 && (
            <button
              onClick={handlePrevious}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Previous
            </button>
          )}
          
          {step < 3 && (
            <button
              onClick={handleNext}
              disabled={step === 1 && isLoading}
              className={`px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                step === 1 && isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {step === 1 ? "Continue to Payment" : "Place Order"}
            </button>
          )}
          
          {step === 3 && (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Back to Shop
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Shipping Step Component
const ShippingStep = ({
  shippingAddress,
  setShippingAddress,
  items,
  subtotal,
  tax,
  shipping,
  total,
}: {
  shippingAddress: any;
  setShippingAddress: React.Dispatch<React.SetStateAction<any>>;
  items: any[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Shipping Information
      </p>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter first name"
              value={shippingAddress.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter last name"
              value={shippingAddress.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="street"
            placeholder="Enter street address"
            value={shippingAddress.street}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apartment, suite, etc. (optional)
            </label>
            <input
              type="text"
              name="apartment"
              placeholder="Enter apartment or suite"
              value={shippingAddress.apartment}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              placeholder="Enter city"
              value={shippingAddress.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="state"
              placeholder="Enter state"
              value={shippingAddress.state}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ZIP / Postal Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="postalCode"
              placeholder="Enter ZIP or postal code"
              value={shippingAddress.postalCode}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <select
            name="country"
            value={shippingAddress.country}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="Japan">Japan</option>
          </select>
        </div>
      </div>
      
      {/* Order Summary */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Order Summary
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Tax (estimated)</span>
            <span>{formatPrice(tax)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{formatPrice(shipping)}</span>
          </div>
          
          <div className="pt-4 border-t border-gray-200 flex justify-between">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-gray-900">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Payment Step Component
const PaymentStep = ({
  paymentMethod,
  setPaymentMethod,
  total,
}: {
  paymentMethod: string;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
  total: number;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };
  
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Payment Method
      </h2>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-gray-600">
            Securely process your payment with our trusted payment partners
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <input
                  id="credit_card"
                  type="radio"
                  name="paymentMethod"
                  value="credit_card"
                  checked={paymentMethod === "credit_card"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
              </div>
              <div className="ml-3 flex-1">
                <label htmlFor="credit_card" className="font-medium text-gray-900">
                  Credit or Debit Card
                </label>
                <p className="mt-1 text-sm text-gray-500">
                  We accept Visa, Mastercard, American Express, and Discover
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <input
                  id="paypal"
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
              </div>
              <div className="ml-3 flex-1">
                <label htmlFor="paypal" className="font-medium text-gray-900">
                  PayPal
                </label>
                <p className="mt-1 text-sm text-gray-500">
                  Pay securely with your PayPal account
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <input
                  id="razorpay"
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
              </div>
              <div className="ml-3 flex-1">
                <label htmlFor="razorpay" className="font-medium text-gray-900">
                  Razorpay
                </label>
                <p className="mt-1 text-sm text-gray-500">
                  Pay with Razorpay (popular in India)
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <input
                  id="cash_on_delivery"
                  type="radio"
                  name="paymentMethod"
                  value="cash_on_delivery"
                  checked={paymentMethod === "cash_on_delivery"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
              </div>
              <div className="ml-3 flex-1">
                <label htmlFor="cash_on_delivery" className="font-medium text-gray-900">
                  Cash on Delivery
                </label>
                <p className="mt-1 text-sm text-gray-500">
                  Pay in cash when your order arrives (additional charges may apply)
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Order Summary
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-bold text-gray-900">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Confirmation Step Component
const ConfirmationStep = ({
  onSubmit,
  navigate,
}: {
  onSubmit: () => void;
  navigate: ReturnType<typeof useNavigate>;
}) => {
  return (
    <div className="text-center py-12">
      <div className="mb-6">
        <svg className="h-12 w-12 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Order Placed Successfully!
      </h2>
      
      <p className="text-lg text-gray-600 mb-6">
        Thank you for your purchase. Your order has been confirmed and is being processed.
      </p>
      
      <div className="space-y-4">
        <p className="text-gray-500">
          You will receive an email confirmation shortly with your order details.
        </p>
        
        <p className="text-gray-500">
          You can track your order status in your account under "My Orders".
        </p>
      </div>
      
      <div className="mt-8">
        <button
          onClick={onSubmit}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Shop
        </button>
      </div>
    </div>
  );
};
