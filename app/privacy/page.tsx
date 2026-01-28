import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | AceDBE',
    description: 'Privacy Policy for AceDBE - Practice Portal',
};

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 border-b border-gray-800 pb-4">Privacy Policy</h1>

                <p className="mb-6 text-gray-400">Last updated: January 28, 2026</p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                    <p className="leading-relaxed mb-4">
                        Welcome to AceDBE (https://acedbe.vercel.app). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.
                    </p>
                </section>

                <section className="mb-8 border-t border-gray-800 pt-8">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-400">2. Google AdSense and Cookies</h2>
                    <p className="leading-relaxed mb-4">
                        We use Google AdSense to serve ads when you visit our website. Google uses cookies to serve ads based on a user's prior visits to your website or other websites.
                    </p>
                    <ul className="list-disc ml-6 space-y-2 mb-4">
                        <li>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
                        <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Ads Settings</a>.</li>
                    </ul>
                </section>

                <section className="mb-8 border-t border-gray-800 pt-8">
                    <h2 className="text-2xl font-semibold mb-4">3. Information We Collect</h2>
                    <p className="leading-relaxed mb-4">
                        We collect very minimal information. We use Google Analytics to monitor site traffic and user behavior to improve the user experience. This data is anonymized and does not identify you personally.
                    </p>
                </section>

                <section className="mb-8 border-t border-gray-800 pt-8">
                    <h2 className="text-2xl font-semibold mb-4">4. Third-Party Links</h2>
                    <p className="leading-relaxed mb-4">
                        Our website contains links to other websites (like YouTube for playlists). Clicking on those links may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
                    </p>
                </section>


                <div className="mt-12">
                    <a href="/" className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
}
