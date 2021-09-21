import React               from 'react';
import { Route, Redirect } from 'react-router';

import App from './containers/App.jsx';

import MainLayout from './containers/layouts/MainLayout.jsx';

import ActivationsPageContainer       from './containers/pages/ActivationsPage.jsx';
import ActivationPageContainer        from './containers/pages/ActivationPage.jsx';
import ShareResultPageContainer       from './containers/pages/ShareResultPage.jsx';
import CustomShareResultPageContainer from './containers/pages/CustomShareResultPage.jsx';
import PromoPageContainer             from './containers/pages/PromoPage.jsx';

export default (
    <Route component={App} >
        <Redirect from='/' to='/activations' />
        <Redirect from='' to='/activations' />

        <Route component={MainLayout} path='/'>
            <Redirect from='/kmda/start' to='/activations?search=english' />

            <Route component={ActivationsPageContainer} path='/activations' />

            <Route component={ActivationPageContainer} path='/activations/:id' />
            <Route component={ActivationPageContainer} path='/activations/:id/:title' />


            <Route component={ShareResultPageContainer} path='/result/:id/:accountId' />
            <Route component={CustomShareResultPageContainer} path='/share/:key' />

            <Route component={PromoPageContainer} path='/promo/:key' />

        </Route>
    </Route>
);
