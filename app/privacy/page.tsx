import Markdown from "react-markdown";

export default async function PrivacyPolicy() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <section className="w-full min-h-screen py-12 bg-gradient-to-tr from-muted to-card">
        <div className="container px-4 md:px-6 max-w-3xl">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Privacy Policy
            </h1>
            <span className="mt-2 text-gray-600 dark:text-gray-400">
              <Markdown>
                Welcome to Swing Check ltd. ("Swing Check", "we", "us" and/or
                "our"). At Swing Check, we are committed to protecting your
                privacy and safeguarding your personal information. This Privacy
                Policy outlines how we collect, use, disclose, and store your
                data when you interact with our website, services, and products.
                By accessing or using Swing Check's services, you agree to the
                practices outlined in this Privacy Policy. If you do not agree
                to this policy, please do not use our services. Information We
                Collect Personal Information: When you sign up for Swing Check
                or use our services, we may collect personal information such as
                your name, email address, billing details, and any other
                information you provide to us. Usage Data: We may collect
                information about how you interact with our website and
                services. This includes but is not limited to your IP address,
                browser type, device information, pages visited, and the
                duration of your visit. Cookies and Tracking Technologies: Shot
                Check uses cookies and similar tracking technologies to enhance
                your experience on our website. These technologies allow us to
                collect information such as your preferences and track your
                activity on our website. User Feedback and Communication: If you
                contact us for support or provide feedback, we may collect
                information related to your communication with us. How We Use
                Your Information Providing Services: We use your personal
                information to provide, maintain, and improve our services,
                including processing your orders, providing customer support,
                and personalizing your experience. Communication: We may use
                your contact information to communicate with you about your
                account, updates, and promotional offers. You can opt-out of
                marketing communications at any time. Analytics and
                Improvements: We analyze usage data to understand how users
                interact with our website and services. This helps us improve
                our products, content, and user experience. Security and Fraud
                Prevention: We use your information to protect our users and
                prevent unauthorized access, fraud, or illegal activities. Legal
                Compliance: We may need to use and retain your information to
                comply with legal obligations or resolve disputes. Data Sharing
                and Disclosure Third-Party Service Providers: We may share your
                information with third-party service providers who assist us in
                delivering our services, conducting analytics, or processing
                payments. These providers are required to protect your data and
                use it solely for the purposes we specify. Business Transfers:
                In the event of a merger, acquisition, or sale of Swing Check,
                your information may be transferred to the new entity. Legal
                Requirements: We may disclose your information when required by
                law or to protect our rights, privacy, safety, or property. Data
                Security We take appropriate measures to protect your
                information from unauthorized access, alteration, disclosure, or
                destruction. However, please understand that no data
                transmission over the internet or storage system can be
                guaranteed as 100% secure. Your Rights You have the right to
                access, update, or delete your personal information. If you wish
                to exercise any of these rights or have concerns about your
                data, please contact us using the information provided below.
                Changes to This Policy Swing Check may update this Privacy
                Policy from time to time. We will notify you of significant
                changes by posting a prominent notice on our website or via
                email.
              </Markdown>
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
