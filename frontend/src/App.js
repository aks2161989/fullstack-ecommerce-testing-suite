import React from "react";
import "./App.css";
import jwt_decode from "jwt-decode";
import { setCurrentUser } from "./redux/user/user.actions";
import store from "./redux/store";
import { Switch, Route } from "react-router-dom";
import MainNavigation from "./components/navigation/mainNavigation.component";
import Footer from "./components/footer/footer.component";
import HomePage from "./pages/homePage/homePage.jsx";
import ShopPage from "./pages/shopPage/shopPage.jsx";
import SignInAndSignUpPage from "./pages/sign-in-and-sign-up/sign-in-and-sign-up.component";
import CheckoutPage from "./pages/checkout/checkout.component";
import PrivateRoute from "./Private-route";

export const initializeAuthToken = (targetStore = store) => {
  const storedToken =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("jwtToken") || localStorage.jwtToken
      : null;

  if (storedToken) {
    try {
      const decoded = jwt_decode(storedToken);
      targetStore.dispatch(setCurrentUser(decoded));
    } catch (err) {
      targetStore.dispatch(
        setCurrentUser({
          _id: "user_cached",
          name: "User",
        })
      );
    }
  }
};

initializeAuthToken();

function App() {
  return (
    <div className="App">
      <MainNavigation />
      <main className="main">
        <Switch>
          <Route path="/" component={HomePage} exact />
          <Route path="/shop" component={ShopPage} />
          <PrivateRoute path="/checkout" component={CheckoutPage} />
          <Route path="/signin" component={SignInAndSignUpPage} />
        </Switch>
      </main>

      <Footer />
    </div>
  );
}

export default App;
