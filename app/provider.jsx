"use client"
import { UserDetailContext } from '@/context/UserDetailContext';
import supabase from '@/services/supabaseClient';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import React, { useEffect, useState } from 'react';


function Provider({ children }) {
  const [user, setUser] = useState();

  useEffect(() => {
    createNewUser();
  }, []);

  const createNewUser = () => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        console.log("No authenticated user found.");
        return;
      }

    let { data: Users, error } = await supabase
      .from('Users')
      .select('*')
      .eq('email', user.email);

    if (!Users || Users.length === 0) {
      const { data, error } = await supabase.from('Users').insert([{
        email: user?.email,
        name: user?.user_metadata.name,
        picture: user?.user_metadata.picture,
      }]);
      setUser(data);
      console.log("Inserted new user:", data);
      return;
    }

    setUser(Users[0]);
    console.log("Users", Users[0]);
  });
  }
  
  return (
    <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test", currency: "USD" }}>
    <UserDetailContext.Provider value={{ user, setUser }}>
      <div>{children}</div>
    </UserDetailContext.Provider>
    </PayPalScriptProvider>
  )
}

export default Provider

export const useUser = () => { const context = React.useContext(UserDetailContext);
  // if (!context) {
  //   throw new Error("useUser must be used within a UserDetailProvider");
  // }
  return context;
}