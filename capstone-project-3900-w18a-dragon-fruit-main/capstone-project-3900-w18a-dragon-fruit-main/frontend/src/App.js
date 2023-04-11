import * as React from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import LoadingPage from "./Pages/LoadingPage";
import LoginPage from "./Pages/PublicPages/LoginPage";
import CustomerSignupPage from "./Pages/PublicPages/CustomerSignupPage"
import RestaurantSignupPage from "./Pages/PublicPages/RestaurantSignupPage";
import SignupSelectPage from "./Pages/PublicPages/SignupSelectPage"
import ProfilePage from "./Pages/ProfilePage"
import CustomerFriendsPage from "./Pages/CustomerPages/CustomerFriendsPage"
import RestaurantProfilePage from "./Pages/RestaurantPages/RestaurantProfilePage";
import RestaurantListPage from "./Pages/PublicPages/RestaurantListPage"
import RestaurantDetailPage from "./Pages/PublicPages/RestaurantDetailPage";
import RestaurantMenuShowPage from "./Pages/PublicPages/RestaurantMenuShowPage";
import RestaurantHomePage from "./Pages/RestaurantHomePage";
import RestaurantEditNamePage from "./Pages/RestaurantPages/RestaurantEditNamePage";
import RestaurantEditCuisinesPage from './Pages/RestaurantPages/RestaurantEditCuisinesPage'
import RestaurantEditOverviewPage from "./Pages/RestaurantPages/RestaurantEditOverviewPage";
import RestaurantMenuPage from "./Pages/RestaurantPages/RestaurantMenuPage";
import RestaurantMenuAddPage from "./Pages/RestaurantPages/RestaurantMenuAddPage";
import RestaurantVoucherPage from "./Pages/RestaurantPages/RestaurantVoucherPage";
import RestaurantCommitsPage from "./Pages/RestaurantPages/RestaurantCommitsPage";
import RestaurantPhotoAddPage from "./Pages/RestaurantPhotoAddPage";
import RestaurantPhotoPage from "./Pages/RestaurantPages/RestaurantPhotoPage";
import CustomerFriendAddPage from "./Pages/CustomerPages/CustomerFriendAddPage";
import CustomerVouchersPage from "./Pages/CustomerPages/CustomerVouchersPage";
import CustomerVouchersDetailPage from "./Pages/CustomerPages/CustomerVouchersDetailPage";
import CustomerVouchersCommentPage from "./Pages/CustomerPages/CustomerVouchersCommentPage";
import RestaurantVoucherAddPage from "./Pages/RestaurantPages/RestaurantVoucherAddPage";
import RestaurantVoucherShowPage from "./Pages/PublicPages/RestaurantVoucherShowPage";
import RestaurantMenuChangePage from "./Pages/RestaurantPages/RestaurantMenuChangePage";
import RestaurantPhotoShowPage from "./Pages/PublicPages/RestaurantPhotoShowPage";
import RestaurantVoucherVerifyPage from "./Pages/RestaurantPages/RestaurantVoucherVerifyPage";
import RestaurantVoucherChangePage from "./Pages/RestaurantPages/RestaurantVoucherChangePage";
import UpdatePasswordPage from "./Pages/PublicPages/UpdatePasswordPage";
import CustomerMessagePage from "./Pages/CustomerPages/CustomerMessagePage";
import {loadCSS} from "fg-loadcss";

function App() {
    React.useEffect(() => {
        const node = loadCSS(
            'https://use.fontawesome.com/releases/v6.1.0/css/all.css',
            // Inject before JSS
            document.querySelector('#font-awesome-css') || document.head.firstChild,
        );

        return () => {
            node.parentNode.removeChild(node);
        };
    }, []);
  return (
      <React.Fragment>
          <Routes>
              <Route path="/" element={<LoadingPage />} />
              {/*<Route path="/restaurants/recommend" element={<RestaurantListPage />} />*/}
              <Route path="/restaurants/:id" element={<RestaurantListPage />} />
              <Route path='/restaurant/:id' element={<RestaurantDetailPage />} />
              <Route path='/restaurant/:id/menu' element={<RestaurantMenuShowPage/>} />
              <Route path='/restaurant/:id/voucher' element={<RestaurantVoucherShowPage/>} />
              <Route path='/restaurant/:id/photo' element={<RestaurantPhotoShowPage/>} />

              <Route path="/signup" element={<SignupSelectPage />} />
              <Route path="/signup/customer" element={<CustomerSignupPage />} />
              <Route path="/signup/restaurant" element={<RestaurantSignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/password/update" element={<UpdatePasswordPage />} />

              <Route path="/profile" element={<ProfilePage />} />
              <Route path='/friends/:id' element={<CustomerFriendsPage />} />
              <Route path='/friend/add' element={<CustomerFriendAddPage />} />
              <Route path='/customer/vouchers/:id' element={<CustomerVouchersPage />} />
              <Route path='/customer/voucher/detail/:id' element={<CustomerVouchersDetailPage />} />
              <Route path='/customer/voucher/comment/:id' element={<CustomerVouchersCommentPage />} />
              <Route path='/messages/:id' element={<CustomerMessagePage />} />

              <Route path="/restaurant/profile" element={<RestaurantProfilePage />} />
              <Route path='/restaurant/home' element={<RestaurantHomePage />} />
              <Route path='/restaurant/comments' element={<RestaurantCommitsPage />} />
              <Route path='/restaurant/menu' element={<RestaurantMenuPage />} />
              <Route path='/restaurant/menu/add' element={<RestaurantMenuAddPage />} />
              <Route path='/restaurant/menu/:id/change' element={<RestaurantMenuChangePage />} />
              <Route path='/restaurant/voucher' element={<RestaurantVoucherPage />} />
              <Route path='/restaurant/voucher/add' element={<RestaurantVoucherAddPage />} />
              <Route path='/restaurant/voucher/:id/change' element={<RestaurantVoucherChangePage />} />
              <Route path='/restaurant/voucher/verify' element={<RestaurantVoucherVerifyPage />} />
              <Route path='/restaurant/photo' element={<RestaurantPhotoPage />} />
              <Route path='/restaurant/photo/add' element={<RestaurantPhotoAddPage />} />
              <Route path='/restaurant/edit/context' element={<RestaurantEditNamePage />} />
              <Route path='/restaurant/edit/cuisines' element={<RestaurantEditCuisinesPage />} />
              <Route path='/restaurant/edit/overview' element={<RestaurantEditOverviewPage />} />
          </Routes>
      </React.Fragment>
  );
}

export default App;
