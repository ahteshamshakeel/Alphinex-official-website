'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AnimatedHeader from '@/components/AnimatedHeader';

interface Project {
  id: string;
  title: string;
  description: string;
  cost: string;
  coverImage?: string;
  images: string[];
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/projects');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch projects');
      }
      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError(error instanceof Error ? error.message : 'Something went wrong while loading projects.');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gradient-to-b from-[#0a0a0f] via-[#0f1420] to-[#0a0a0f]">
      <Navbar />

      <AnimatedHeader
        title="Our Projects"
        description="Explore our portfolio of successful projects and see what we can build for you."
      />

      <section className="relative py-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-40 right-40 w-96 h-96 bg-purple-600/10 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-40 left-40 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="text-gray-400 mt-4">Loading projects...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-lg mx-auto">
                <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h3 className="text-xl font-bold text-white mb-2">Unable to Load Projects</h3>
                <p className="text-gray-400 mb-6">{error}</p>
                <button
                  onClick={fetchProjects}
                  className="px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 border border-blue-500/30"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No projects available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/50 transition-all duration-300"
                >
                  {/* Cover Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-800">
                    {project.coverImage || project.images[0] ? (
                      <img
                        src={project.coverImage || project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600/20 to-purple-600/20">
                        <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-green-400 font-bold text-lg">{project.cost}</span>
                      </div>
                    </div>

                    <Link
                      href={`/projects/${project.id}`}
                      target="_blank"
                      className="w-full px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-white font-bold rounded-xl transition-all duration-300 hover:scale-110 border border-blue-500/30 flex items-center justify-center gap-2 group"
                    >
                      View Details
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-20 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-20 w-96 h-96 bg-purple-600/10 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div>
                <Link href="/">
                  <img src="/logo.svg" alt="Alphinex Solutions" className="h-10 w-auto mb-4" />
                </Link>
                <p className="text-gray-300 mb-6 text-sm font-medium leading-relaxed">
                  Alphinex Solutions delivers cutting-edge AI-powered software development and intelligent IT consulting services. We specialize in AI web and mobile applications, smart cloud solutions, and AI-driven digital transformation. Our expert team transforms your vision into scalable, innovative AI-enhanced technology solutions that drive business growth and exceed expectations.
                </p>
                <div className="flex gap-3">
                  <a href="https://facebook.com/alphinexsolutions/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-blue-600/20 hover:bg-blue-600/30 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/company/alphinex-solutions/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-blue-600/20 hover:bg-blue-600/30 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a href="https://github.com/alphinex/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-purple-600/20 hover:bg-purple-600/30 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                  <a href="https://wa.me/923253028856" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-green-600/20 hover:bg-green-600/30 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-4 text-white text-base">AI Services</h4>
                <ul className="space-y-2 text-sm text-gray-400 font-medium">
                  <li><Link href="/" className="hover:text-blue-400 transition-colors">AI Web Development</Link></li>
                  <li><Link href="/" className="hover:text-blue-400 transition-colors">AI Mobile Development</Link></li>
                  <li><Link href="/" className="hover:text-blue-400 transition-colors">AI Cloud Solutions</Link></li>
                  <li><Link href="/" className="hover:text-blue-400 transition-colors">AI Video Editing</Link></li>
                  <li><Link href="/" className="hover:text-blue-400 transition-colors">AI Automation</Link></li>
                  <li><Link href="/" className="hover:text-blue-400 transition-colors">AI UI/UX Design</Link></li>
                  <li><Link href="/" className="hover:text-blue-400 transition-colors">AI Consulting</Link></li>
                  <li><Link href="/" className="hover:text-blue-400 transition-colors">AI-Powered Support</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4 text-white text-base">Contact Us</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <h5 className="text-white font-bold mb-2">Email</h5>
                    <div className="space-y-1 text-gray-400 font-medium">
                      <p className="hover:text-blue-400 transition-colors">alphinexsolutions@gmail.com</p>
                      <p className="hover:text-blue-400 transition-colors">suleman@alphinex.com</p>
                      <p className="hover:text-blue-400 transition-colors">nouman@alphinex.com</p>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-white font-bold mb-2">Phone</h5>
                    <div className="space-y-1 text-gray-400 font-medium">
                      <p className="hover:text-blue-400 transition-colors">+92 325 3028856</p>
                      <p className="hover:text-blue-400 transition-colors">+92 306 4212632</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-4 text-white text-base">Our Locations</h4>
                <div className="space-y-4 text-sm text-gray-400 font-medium">
                  <div>
                    <h5 className="text-white font-bold mb-2">United States</h5>
                    <p>8 The Green, Suite A<br />Dover, Delaware<br />United States of America</p>
                  </div>
                  <div>
                    <h5 className="text-white font-bold mb-2">Pakistan</h5>
                    <p>Office# 13, 2nd Floor<br />Ali Arcade, 6th Road<br />Rawalpindi, Pakistan</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm font-medium">&copy; 2026 Alphinex Solutions. All rights reserved.</p>
              <Link href="/privacy" className="text-gray-400 hover:text-blue-400 text-sm font-semibold transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
