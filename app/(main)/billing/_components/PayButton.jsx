import React, { use } from 'react'
import { PayPalButtons } from '@paypal/react-paypal-js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from '@/app/provider';
import supabase from '@/services/supabaseClient';

function PayButton({amount, credits}) {
    const {user} = useUser();
    const OnPaymentSuccess = async (details) => {
        await supabase
            .from('Users')
            .update({ credits: Number(user?.credits) + credits })
            .eq('user_id', user?.id);
    }

  return (
    <div>
      <Dialog>
        <DialogTrigger className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">
          Buy Credits
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="sr-only">Payment</DialogTitle>
            <DialogDescription asChild>
              <PayPalButtons
                className='grey-200'
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [{
                      amount: {
                        value: amount
                      }
                    }]
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order.capture().then((details) => {
                    alert(`Transaction completed by ${details.payer.name.given_name}`);
                  });
                }}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PayButton