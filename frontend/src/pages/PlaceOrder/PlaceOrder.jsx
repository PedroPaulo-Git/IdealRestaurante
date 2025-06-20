import React, { useContext, useState, useEffect } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripeForm from "../../components/FormPayment/StripePayment";
import ReactLoading from "react-loading";

const PlaceOrder = () => {
  //  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);

  //TRYING TO PASS KEY TO STRIPE PROMISE
  //
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const [costumer, setCostumer] = useState("");

  const { getTotalCart, clientId, cartItems, clientEmail } =
    useContext(StoreContext);
  //ponst PORT = process.env.REACT_APP_PORT || 3000;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  //  useEffect(()=>{
  //   console.log("BACK",backendUrl,PORT)
  //  },[backendUrl])
  //   console.log("BACK",backendUrl)
  const url = `${backendUrl}/api/address/${clientId}`;

  // console.log("Stripe Publish Key:", process.env.REACT_APP_STRIPE_PUBLISH_KEY);
  // console.log("All environment variables:", process.env);
  // console.log(PORT)

  const fetchStripeConfig = async () => {
    try {
      setLoadingPayment(true);

      const response = await fetch(`${backendUrl}/api/config`);
      // const { stripePublishKey } = await response.json();
      setStripePromise(loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY));


      // setStripePromise(loadStripe(stripePublishKey));
      // console.log(stripePromise)
      // Only call handlePayment after the Stripe config is fetched
      await handlePayment();
      if (response.ok) {
        setTimeout(() => {
          setLoadingPayment(false);
        }, 1000);
      } else {
        setLoadingPayment(true);
      }
    } catch (error) {
      console.error("Error fetching Stripe publishable key:", error);
    }
  };
  useEffect(() => {
    console.log("STRIPE KEY =>", import.meta.env.VITE_STRIPE_PUBLISH_KEY);

    if (clientId) {
      fetchStripeConfig();
    }
  }, [clientId]);

  const handlePayment = async () => {
    const addressData = {
      line1: address,
      line2: "", // Optional
      city: city,
      postal_code: zipcode,
      country: "BR", // Adjust as necessary
      firstName: firstName,
      lastName: lastName,
      email: clientEmail,
      phone: phone,
    };

    console.log("ADDRESS > ", addressData);
    const totalAmount = getTotalCart();

    if (totalAmount > 0 && firstName && lastName && clientEmail) {
      try {
        // Create customer
        const response = await fetch(
          `${backendUrl}/api/create-customer/${clientId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: clientEmail,
              name: `${firstName} ${lastName}`,
              phone: phone,
              address: addressData,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create customer");
        }
        const { customerId } = await response.json();
        console.log("Customer ID FIRST:", customerId);
        console.log(costumer.length);
        if (!costumer) {
          setCostumer(customerId);
        }

        if (costumer.length <= 0) {
          // Get customer ID from response
          setCostumer(customerId);
        } else if (costumer.length > 0) {
          console.log("Customer ID ALREADY EXIST:", costumer);
        } else {
          console.log("something wrong", costumer);
        }

        console.log("Customer ID SECOND:", costumer);

        // Create payment intent
        const paymentIntentResponse = await fetch(
          `${backendUrl}/api/create-payment-intent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: totalAmount * 100, // Stripe expects amount in cents
              address: addressData,
              customerId: customerId,
            }),
          }
        );

        if (!paymentIntentResponse.ok) {
          throw new Error("Failed to create payment intent");
        }

        const { clientSecret } = await paymentIntentResponse.json();
        setClientSecret(clientSecret); // Set the client secret for Stripe
        // console.log("Client Secret:", clientSecret);
        console.log("Finally costumer id > ", costumer);
      } catch (error) {
        console.error("Error during payment process:", error);
      }
    } else if (totalAmount <= 0) {
      console.log("Added some items in your cart");
    }
  };
  // useEffect(() => {
  //   fetchStripeConfig(); // Call the function when the component mounts
  // }, []);

  const sucessfullMessage = () => {
    setIsEditing(false);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(null);
    }, 2000);
  };

  useEffect(() => {
    //console.log(isEditing)
    //console.log(url)
    if (!url || url.includes("null")) {
      //console.error('URL is null or invalid');
      return;
    }
    const fetchAddress = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setPhone(data.phone);
          setAddress(data.address);
          setCity(data.city);
          setZipcode(data.zipcode);
        } else {
          console.error("Failed to fetch address");
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };
    fetchAddress();
  }, [url]);

  const addressForm = async (e) => {
    e.preventDefault();
    console.log(url);

    const getInfoClient = {
      firstName,
      lastName,
      phone,
      address,
      city,
      zipcode,
    };
    console.log(getInfoClient);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(getInfoClient),
      });
      const data = await response.json();
      if (response.ok) {
        //await handleSubmit();
        console.log("Address updated successfully:", data);
        // You can trigger a new fetch here to update payment intent
        console.log(data);
        sucessfullMessage();
      } else {
        console.error("Error updating address:", response);
      }
    } catch (error) {
      console.log("Error connection CATCH", error);
    }
  };

  return (
    <div className="delivery-form">
      {showSuccessMessage && (
        <div className="addressEdited-success">
          Endereço alterado com sucesso !
        </div>
      )}

      <div className="delivery-left-form-inputs">
        <div className="delivery-left">
          <div className="delivery-left-form">
            {isEditing ? (
              <form onSubmit={addressForm} className="form">
                <div className="delivery-left-form-inputs">
                  <div className="delivery-left">
                    <h1>Editar Informações de Entrega</h1>
                    <div className="delivery-left-form">
                      <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        type="text"
                        placeholder="Nome"
                      />

                      <input
                        type="text"
                        placeholder="Sobrenome"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Rua"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />

                    <div className="delivery-left-form-inputs">
                      <input
                        type="text"
                        placeholder="Cidade"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />

                      <input
                        type="text"
                        placeholder="CEP"
                        pattern="^\d{5}-\d{3}$"
                        inputMode="numeric"
                        maxLength="9"
                        value={zipcode}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                          if (value.length > 5) {
                            value = value.replace(/^(\d{5})(\d{1,3})/, "$1-$2"); // Format as XXXXX-XXX
                          }
                          setZipcode(value);
                        }}
                      />
                    </div>

                    <input
                      type="tel"
                      placeholder="Telefone"
                      pattern="^\(\d{2}\) \d{5}-\d{4}$"
                      inputMode="numeric"
                      maxLength="15"
                      required
                      value={phone}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "");
                        if (value.length > 10) {
                          value = value.replace(
                            /^(\d{2})(\d{5})(\d{4})/,
                            "($1) $2-$3"
                          );
                        } else if (value.length > 6) {
                          value = value.replace(/^(\d{2})(\d{4,5})/, "($1) $2");
                        } else if (value.length > 2) {
                          value = value.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
                        } else if (value.length > 0) {
                          value = value.replace(/^(\d{0,2})/, "($1");
                        }
                        setPhone(value);
                      }}
                    />
                  </div>
                </div>
                <div className="delivery-buttons-form">
                  <button type="submit" className="cart-total-details-button">
                    Editar
                  </button>
                  <button
                    type="button"
                    className="cart-total-details-button"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className="form">
                <div className="delivery-left-form-inputs">
                  <div className="delivery-left">
                    <h1>Informações de Entrega</h1>
                    {clientEmail}
                    <div className="delivery-left-form">
                      <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        type="text"
                        placeholder="Nome"
                        readOnly
                      />

                      <input
                        type="text"
                        placeholder="Sobrenome"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        readOnly
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Rua"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      readOnly
                    />

                    <div className="delivery-left-form-inputs">
                      <input
                        type="text"
                        placeholder="Cidade"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        readOnly
                      />

                      <input
                        type="text"
                        placeholder="CEP"
                        readOnly
                        pattern="[0-9]*"
                        inputMode="numeric"
                        maxLength="9"
                        value={zipcode}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, ""); // Remove any non-numeric characters
                          if (value.length > 5) {
                            value = value.replace(/^(\d{5})(\d{1,3})/, "$1-$2"); // Add the dash after the first 5 digits
                          }
                          setZipcode(value);
                        }}
                      />
                    </div>
                    <input
                      type="tel"
                      placeholder="Telefone"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      maxLength="15"
                      required
                      readOnly
                      value={phone}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, ""); // Remove any non-numeric characters
                        if (value.length > 10) {
                          value = value.replace(
                            /^(\d{2})(\d{5})(\d{4})/,
                            "($1) $2-$3"
                          ); // Format as (XX) XXXXX-XXXX
                        } else if (value.length > 6) {
                          value = value.replace(/^(\d{2})(\d{4,5})/, "($1) $2"); // Format as (XX) XXXX or (XX) XXXXX
                        } else if (value.length > 2) {
                          value = value.replace(/^(\d{2})(\d{0,5})/, "($1) $2"); // Format as (XX) XXX
                        } else if (value.length > 0) {
                          value = value.replace(/^(\d{0,2})/, "($1"); // Format as (XX
                        }
                        setPhone(value);
                      }}
                    />
                  </div>
                </div>
                <button
                  className="cart-total-details-button"
                  onClick={() => setIsEditing(true)}
                >
                  Editar/Adicionar Endereço
                </button>
              </div>
            )}
          </div>
          <div className="delivery-left-form-inputs"></div>
        </div>
      </div>

      <div className="cart-total-left">
        <h1>Total do Carrinho</h1>

        <div className="cart-total-details">
          <p>Subtotal</p>
          R${getTotalCart()}
        </div>
        <div className="cart-total-details">
          <p>Taxa de Entrega</p>
          R${0}
        </div>
        <div className="cart-total-details-total">
          <p>Total</p>
          R${getTotalCart()}
        </div>
        {loadingPayment ? (
          <button
            className="cart-total-details-button"
            onClick={fetchStripeConfig}
          >
            <ReactLoading
              margin={"auto"}
              type={"spin"}
              color={"#FFFFFF"}
              height={"1vw"}
              width={"1vw"}
            />
          </button>
        ) : (
          <button
            className="cart-total-details-button"
            onClick={fetchStripeConfig}
          >
            Pagar com cartão
          </button>
        )}

        {/* <button className='cart-total-details-button'>Concluir Pagamento</button> */}

        {stripePromise && clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <StripeForm handlePayment={handlePayment} />
          </Elements>
        )}
      </div>
    </div>
  );
};
export default PlaceOrder;
