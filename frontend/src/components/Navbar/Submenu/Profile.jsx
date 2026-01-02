import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../action/useraction';
import { useSettingsContext } from '../../../Contaxt/SettingsContext';
import { useServerAuth } from '../../../Contaxt/AuthContext';
import { Button } from '../../ui/button';

const Profile = ({ show, CMenu, parentCallback, user }) => {
    const dispatch = useDispatch();
    const { checkAuthUser } = useServerAuth();
    const { checkAndCreateToast } = useSettingsContext();

    const logoutBTN = async () => {
        await dispatch(logout());
        await checkAuthUser();
        localStorage.removeItem('token');
        checkAndCreateToast("Logout Successfully");
    };

    return (
        <div
            className={`absolute top-full right-0 mt-2 w-64 bg-white border rounded-lg shadow-xl transition-all duration-200 origin-top-right z-50 ${show ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'}`}
            onMouseEnter={() => parentCallback('block', true)}
            onMouseLeave={() => parentCallback('hidden', false)}
        >
            <div className="p-4">
                <div className="mb-4">
                    <h3 className="font-bold text-lg text-gray-900">Ayo, welcome in!</h3>
                    {!user && <p className="text-sm text-gray-500">To access account and manage orders</p>}
                    {user && (
                        <div className="mt-2">
                            <p className="text-sm font-medium text-gray-900">{user?.user?.name || user?.name}</p>
                        </div>
                    )}
                </div>

                <div className="space-y-1 border-t border-b py-2 my-2">
                    {user && (
                        <Link to="/dashboard" className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black rounded-md transition-colors">
                            Dashboard
                        </Link>
                    )}
                    <Link to="/bag" className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black rounded-md transition-colors">
                        Bag
                    </Link>
                    <Link to="/dashboard?activetab=Orders-Returns" className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black rounded-md transition-colors">
                        My Orders
                    </Link>
                    <Link to="/dashboard?activetab=Saved-Addresses" className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black rounded-md transition-colors">
                        My Addresses
                    </Link>
                    <Link to="/contact" className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black rounded-md transition-colors">
                        Contact Us
                    </Link>
                </div>

                <div className="mt-4">
                    {user ? (
                        <Button variant="outline" className="w-full" onClick={logoutBTN}>
                            LOGOUT
                        </Button>
                    ) : (
                        <Link to="/Login">
                            <Button className="w-full">
                                LOGIN / SIGNUP
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;