import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
export default function PaypalButton({amount,onSuccess,onError}) {
  return (
    <div>
      <PayPalScriptProvider options={{ "client-id": "test" }}>
        <PayPalButtons 
        style={{layou:"vertical"}}
        createOrder={(date,actions)=>{
            return actions.order.create({
                purchase_units:[{amount:{value:amount}}]
            })
        }}
        approve={(date,actions)=>{
            return actions.order.capture().then(onSuccess)
        }}
        onError={onError}
        />
      </PayPalScriptProvider>
    </div>
  );
}
