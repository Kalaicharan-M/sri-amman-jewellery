import { useState } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";

export function Contact() {
  const showroomAddress = "ST-2, Kollar Theru, Veeraganur, Tamil Nadu 636116";
  const googleMapsQuery =
    "ST-2%2C+Kollar+Theru%2C+Veeraganur%2C+Tamil+Nadu+636116";
  const googleMapsEmbedUrl = `https://www.google.com/maps?q=${googleMapsQuery}&output=embed`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${googleMapsQuery}`;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 3000);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className="bg-white overflow-x-clip">
      <section className="bg-gradient-to-r from-yellow-50 to-yellow-100 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Visit our showroom or reach out to us. We&apos;re here to help you find
            the perfect jewellery.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 mb-10 sm:mb-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4">
              <MapPin className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-gray-900 mb-2">Visit Us</h3>
            <p className="text-sm text-gray-600">
              ST-2, Kollar Theru
              <br />
              Veeraganur, Tamil Nadu 636116
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4">
              <Phone className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-gray-900 mb-2">Call Us</h3>
            <a href="tel:+919363161304" className="text-sm text-yellow-600 hover:text-yellow-700">
              9363161304
            </a>
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4">
              <Mail className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-gray-900 mb-2">Email Us</h3>
            <a
              href="mailto:info@sriammanjewellery.com"
              className="text-sm text-yellow-600 hover:text-yellow-700 break-all"
            >
              info@sriammanjewellery.com
            </a>
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-gray-900 mb-2">Working Hours</h3>
            <p className="text-sm text-gray-600">
              Mon - Sat
              <br />
              10:00 AM - 8:00 PM
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-900 mb-4">Find Our Showroom</h2>
              <p className="text-gray-600">
                Visit us to experience our collection in person and receive
                personalized assistance from our experts.
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg overflow-hidden h-72 sm:h-96 border border-gray-200 shadow-sm">
              <iframe
                src={googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={showroomAddress}
              ></iframe>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://wa.me/919363161304"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>

              <a
                href="tel:+919363161304"
                className="w-full sm:flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors shadow-sm"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </a>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-5 sm:p-8 border border-gray-200 shadow-sm">
            <h2 className="text-gray-900 mb-4">Send Us a Message</h2>
            <p className="text-gray-600 mb-6 sm:mb-8">
              Have a question? Fill out the form below and we&apos;ll get back to you
              within 24 hours.
            </p>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 sm:p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600">
                  Thank you for contacting us. We&apos;ll respond shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-900 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                    placeholder="9363161304"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-900 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors shadow-sm"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl p-6 sm:p-10 text-center text-white shadow-sm">
            <h2 className="mb-4">Visit Our Showroom Today</h2>
            <p className="text-base sm:text-xl text-yellow-50 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Experience our complete collection and receive personalized guidance
              from our jewellery experts. Walk-ins welcome!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <MapPin className="w-5 h-5" />
                Get Directions
              </a>

              <a
                href="tel:+919363161304"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Call to Confirm Visit
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
