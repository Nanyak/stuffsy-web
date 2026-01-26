import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Cloud, Link2, QrCode, KeyRound, Type, ArrowRight } from 'lucide-react'

export function HomePage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 font-heading">
            Stuffsy
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto">
            A collection of useful online tools to make your life easier.
          </p>

          {/* Available Tools */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-slate-900 mb-8 font-heading">Available Tools</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <Link to="/storage" className="group cursor-pointer">
                <Card className="h-full bg-white hover:shadow-lg hover:border-primary/30 transition-all duration-200 border-2 border-transparent">
                  <CardContent className="p-6 text-left">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors duration-200">
                        <Cloud className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2 text-slate-900 font-heading flex items-center gap-2">
                          Cloud Storage
                          <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                        </h3>
                        <p className="text-slate-600">Upload, manage, and share your files securely in the cloud.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/shortener" className="group cursor-pointer">
                <Card className="h-full bg-white hover:shadow-lg hover:border-primary/30 transition-all duration-200 border-2 border-transparent">
                  <CardContent className="p-6 text-left">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors duration-200">
                        <Link2 className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2 text-slate-900 font-heading flex items-center gap-2">
                          URL Shortener
                          <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                        </h3>
                        <p className="text-slate-600">Create short, easy-to-share links from long URLs.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Coming Soon Tools */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-500 mb-8 font-heading">Coming Soon</h2>
            <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <Card className="bg-slate-50/80 border-slate-200/50 hover:bg-slate-100/80 transition-colors duration-200 cursor-default">
                <CardContent className="p-5 text-center">
                  <QrCode className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-1 text-slate-500 font-heading">QR Generator</h3>
                  <p className="text-sm text-slate-400">Generate QR codes instantly</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-50/80 border-slate-200/50 hover:bg-slate-100/80 transition-colors duration-200 cursor-default">
                <CardContent className="p-5 text-center">
                  <KeyRound className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-1 text-slate-500 font-heading">Password Gen</h3>
                  <p className="text-sm text-slate-400">Create secure passwords</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-50/80 border-slate-200/50 hover:bg-slate-100/80 transition-colors duration-200 cursor-default">
                <CardContent className="p-5 text-center">
                  <Type className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-1 text-slate-500 font-heading">Text Tools</h3>
                  <p className="text-sm text-slate-400">Format and convert text</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200">
        <div className="text-center px-4">
          <p className="text-slate-500 text-sm">&copy; 2026 Stuffsy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
