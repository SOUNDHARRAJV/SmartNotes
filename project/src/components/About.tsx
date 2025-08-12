import React, { useState } from 'react';
import { BookOpen, Users, Target, Award, Mail, Phone, Send, UserPlus, CheckCircle } from 'lucide-react';
import { ContactForm, CommunityForm, Department } from '../types';

const About: React.FC = () => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [showCommunityForm, setShowCommunityForm] = useState(false);
  const [showContactSuccess, setShowContactSuccess] = useState(false);
  const [showCommunitySuccess, setShowCommunitySuccess] = useState(false);
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [communityForm, setCommunityForm] = useState<CommunityForm>({
    name: '',
    email: '',
    department: '' as Department,
    customDepartment: '',
    interests: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments: Department[] = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AGRI', 'IT', 'BIOTECH', 'Others'];

  const founders = [
    {
      name: 'Soundhar Raj V',
      role: 'Co-Founder & CEO',
      image: 'https://i.pinimg.com/originals/f2/59/22/f25922fde5d5a44bd82b0336a7d9b23e.jpg',
      description: 'Visionary leader with expertise in educational technology and student engagement.'
    },
    {
      name: 'Dinesh J',
      role: 'Co-Founder & CTO',
      image: 'https://tse1.mm.bing.net/th/id/OIP.I98PBrIrysqPigwaIOK-fgHaEs?pid=Api&P=0&h=180',
      description: 'Technical architect passionate about building scalable educational platforms.'
    },
    {
      name: 'Vaishnavi R',
      role: 'Co-Founder & CPO',
      image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
      description: 'Product strategist focused on creating intuitive user experiences for students.'
    },
    {
      name: 'Kavya D',
      role: 'Co-Founder & CMO',
      image: 'https://images.pexels.com/photos/3586798/pexels-photo-3586798.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
      description: 'Marketing expert dedicated to connecting students with valuable educational resources.'
    }
  ];

  const features = [
    {
      icon: BookOpen,
      title: 'Smart Organization',
      description: 'Intelligent categorization and tagging system for easy content discovery.'
    },
    {
      icon: Users,
      title: 'Collaborative Learning',
      description: 'Connect with peers and share knowledge across departments and subjects.'
    },
    {
      icon: Target,
      title: 'Focused Content',
      description: 'Curated academic materials tailored to your specific department and interests.'
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Community-driven quality control ensures high-standard educational content.'
    }
  ];

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setShowContactForm(false);
      setShowContactSuccess(true);
      setIsSubmitting(false);
      
      // Hide success message after 4 seconds
      setTimeout(() => {
        setShowContactSuccess(false);
      }, 4000);
    }, 1500);
  };

  const handleCommunitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setCommunityForm({ 
        name: '', 
        email: '', 
        department: '' as Department, 
        customDepartment: '',
        interests: '', 
        reason: '' 
      });
      setShowCommunityForm(false);
      setShowCommunitySuccess(true);
      setIsSubmitting(false);
      
      // Hide success message after 4 seconds
      setTimeout(() => {
        setShowCommunitySuccess(false);
      }, 4000);
    }, 1500);
  };

  return (
    <div className="space-y-12">
      {/* Success Messages */}
      {showContactSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center animate-slide-in">
          <CheckCircle size={20} className="mr-3" />
          <div>
            <p className="font-semibold">Message Sent Successfully!</p>
            <p className="text-sm text-green-100">Thanks for reaching out. We'll get back to you shortly.</p>
          </div>
        </div>
      )}

      {showCommunitySuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center animate-slide-in">
          <CheckCircle size={20} className="mr-3" />
          <div>
            <p className="font-semibold">Welcome to Smart Notes Community!</p>
            <p className="text-sm text-green-100">We'll send you updates and resources soon.</p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">About Smart Notes</h1>
        <p className="text-xl text-blue-100 max-w-3xl">
          Empowering students through collaborative learning and intelligent resource sharing. 
          Smart Notes is your academic companion for discovering, organizing, and sharing educational content.
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
        <p className="text-lg text-gray-600 text-center max-w-4xl mx-auto leading-relaxed">
          To revolutionize how students access, share, and collaborate on academic materials. 
          We believe that knowledge grows when shared, and every student deserves access to 
          high-quality educational resources that enhance their learning journey.
        </p>
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose Smart Notes?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <Icon size={24} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Founders Section */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Meet Our Founders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {founders.map((founder, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-4">
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{founder.name}</h3>
              <p className="text-blue-600 font-medium mb-3">{founder.role}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{founder.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-8 text-center">Smart Notes by the Numbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">100+</div>
            <div className="text-indigo-100">Active Students</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">500+</div>
            <div className="text-indigo-100">Shared Resources</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">13+</div>
            <div className="text-indigo-100">Departments</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">100%</div>
            <div className="text-indigo-100">Satisfaction Rate</div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Get in Touch</h2>
        
        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <Mail size={32} className="text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
            <p className="text-blue-600 font-medium">smartnotesbit@gmail.com</p>
            <p className="text-gray-600 text-sm mt-1">We'll respond within 24 hours</p>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <Phone size={32} className="text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
            <p className="text-green-600 font-medium">+91 XXXXX XXXXX</p>
            <p className="text-gray-600 text-sm mt-1">Mon-Fri, 9 AM - 6 PM IST</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setShowContactForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Mail size={18} className="mr-2" />
            Contact Us
          </button>
          <button
            onClick={() => setShowCommunityForm(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <UserPlus size={18} className="mr-2" />
            Join Our Community
          </button>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Contact Us</h3>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What's this about?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Send size={16} className="mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Community Form Modal */}
      {showCommunityForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Join Our Community</h3>
                <button
                  onClick={() => setShowCommunityForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleCommunitySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={communityForm.name}
                    onChange={(e) => setCommunityForm({ ...communityForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={communityForm.email}
                    onChange={(e) => setCommunityForm({ ...communityForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                  <select
                    required
                    value={communityForm.department}
                    onChange={(e) => setCommunityForm({ ...communityForm, department: e.target.value as Department, customDepartment: '' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select your department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {communityForm.department === 'Others' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specify Department *</label>
                    <input
                      type="text"
                      required
                      value={communityForm.customDepartment}
                      onChange={(e) => setCommunityForm({ ...communityForm, customDepartment: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your department"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Interests *</label>
                  <input
                    type="text"
                    required
                    value={communityForm.interests}
                    onChange={(e) => setCommunityForm({ ...communityForm, interests: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Machine Learning, Web Development"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Why do you want to join? *</label>
                  <textarea
                    required
                    rows={3}
                    value={communityForm.reason}
                    onChange={(e) => setCommunityForm({ ...communityForm, reason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tell us what you hope to gain from our community..."
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCommunityForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <UserPlus size={16} className="mr-2" />
                        Join Community
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;