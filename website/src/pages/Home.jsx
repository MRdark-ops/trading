import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import { TrendingUp, Users, Award, Zap, ArrowRight } from 'lucide-react';
import './Home.css';

function Home() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Trading DZ <span className="vip-badge">VIP</span>
          </h1>
          <p className="hero-subtitle">
            Become an affiliate and earn unlimited commissions
          </p>
          <p className="hero-description">
            Join our exclusive affiliate program and start generating passive income
            through multi-level commissions and referral rewards.
          </p>
          
          {user ? (
            <Link to="/dashboard" className="hero-cta">
              Go to Dashboard
              <ArrowRight size={20} />
            </Link>
          ) : (
            <div className="hero-buttons">
              <Link to="/register" className="hero-cta hero-cta-primary">
                Register Now
                <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="hero-cta hero-cta-secondary">
                Login
              </Link>
            </div>
          )}
        </div>
        <div className="hero-visual">
          <div className="gradient-circle circle-1"></div>
          <div className="gradient-circle circle-2"></div>
          <div className="gradient-circle circle-3"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat">
          <h3>50K+</h3>
          <p>Active Members</p>
        </div>
        <div className="stat">
          <h3>$10M+</h3>
          <p>Total Payouts</p>
        </div>
        <div className="stat">
          <h3>100%</h3>
          <p>Transparent System</p>
        </div>
        <div className="stat">
          <h3>24/7</h3>
          <p>Support Available</p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose">
        <h2>Why Choose Trading DZ?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <TrendingUp size={32} />
            </div>
            <h3>Multi-Level Commissions</h3>
            <p>Earn from 5 levels of referrals with decreasing commission rates</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Users size={32} />
            </div>
            <h3>Unlimited Earnings</h3>
            <p>No cap on how much you can earn. More referrals = More income</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Award size={32} />
            </div>
            <h3>Real-Time Tracking</h3>
            <p>Track all your referrals and earnings in real-time dashboard</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Zap size={32} />
            </div>
            <h3>Instant Payments</h3>
            <p>Withdraw your earnings instantly to your wallet anytime</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <TrendingUp size={32} />
            </div>
            <h3>Community Support</h3>
            <p>Join exclusive Telegram channel with daily tips and updates</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Award size={32} />
            </div>
            <h3>Secure & Verified</h3>
            <p>All transactions are verified and secured with blockchain</p>
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="commission-section">
        <h2>Commission Structure</h2>
        <p className="section-subtitle">Earn from your network across 5 levels</p>
        
        <div className="commission-table">
          <div className="commission-row header">
            <div className="col level">Level</div>
            <div className="col commission">Commission Rate</div>
            <div className="col target">Target Members</div>
            <div className="col reward">Bonus per Member</div>
            <div className="col total">Total Potential</div>
          </div>

          <div className="commission-row">
            <div className="col level">Level 1 (Direct)</div>
            <div className="col commission">10%</div>
            <div className="col target">1-10</div>
            <div className="col reward">$25</div>
            <div className="col total">$250</div>
          </div>

          <div className="commission-row">
            <div className="col level">Level 2</div>
            <div className="col commission">8%</div>
            <div className="col target">11-100</div>
            <div className="col reward">$200</div>
            <div className="col total">$18,000</div>
          </div>

          <div className="commission-row">
            <div className="col level">Level 3</div>
            <div className="col commission">6%</div>
            <div className="col target">101-1000</div>
            <div className="col reward">$1,500</div>
            <div className="col total">$1,350,000</div>
          </div>

          <div className="commission-row">
            <div className="col level">Level 4</div>
            <div className="col commission">4%</div>
            <div className="col target">1001-10000</div>
            <div className="col reward">$10,000</div>
            <div className="col total">$90,000,000</div>
          </div>

          <div className="commission-row">
            <div className="col level">Level 5</div>
            <div className="col commission">2%</div>
            <div className="col target">10001+</div>
            <div className="col reward">$50,000</div>
            <div className="col total">Unlimited</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create Account</h3>
            <p>Sign up and complete your profile in minutes</p>
          </div>

          <div className="step-arrow">→</div>

          <div className="step">
            <div className="step-number">2</div>
            <h3>Activate Subscription</h3>
            <p>Send 250 USDT to activate your account</p>
          </div>

          <div className="step-arrow">→</div>

          <div className="step">
            <div className="step-number">3</div>
            <h3>Share Your Link</h3>
            <p>Share your unique referral link with friends</p>
          </div>

          <div className="step-arrow">→</div>

          <div className="step">
            <div className="step-number">4</div>
            <h3>Earn Commissions</h3>
            <p>Start earning from referrals immediately</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Start Earning?</h2>
        <p>Join thousands of successful affiliates today</p>
        {user ? (
          <Link to="/dashboard" className="cta-button">
            Go to Your Dashboard
            <ArrowRight size={20} />
          </Link>
        ) : (
          <Link to="/register" className="cta-button">
            Create Account Now
            <ArrowRight size={20} />
          </Link>
        )}
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>How much does it cost to join?</h4>
            <p>The subscription fee is 250 USDT, which is a one-time payment to activate your account and access all features.</p>
          </div>

          <div className="faq-item">
            <h4>How are commissions calculated?</h4>
            <p>Commissions are calculated based on the subscription fees paid by your referrals. You earn a percentage based on which level they are in your network.</p>
          </div>

          <div className="faq-item">
            <h4>When can I withdraw my earnings?</h4>
            <p>You can withdraw your earnings anytime once you reach the minimum withdrawal amount. Most withdrawals are processed within 24 hours.</p>
          </div>

          <div className="faq-item">
            <h4>Is the platform legitimate?</h4>
            <p>Yes, we are a fully registered affiliate marketing platform with transparent tracking and verified blockchain transactions.</p>
          </div>

          <div className="faq-item">
            <h4>How do I get support?</h4>
            <p>Our support team is available 24/7 via email and our exclusive Telegram channel. You'll also get updates and trading tips daily.</p>
          </div>

          <div className="faq-item">
            <h4>Can I request a refund?</h4>
            <p>Refunds are available within 7 days of subscription. After that, your subscription is non-refundable as per our terms.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
