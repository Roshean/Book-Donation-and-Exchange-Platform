import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

const Donate = () => {
  const [activeTab, setActiveTab] = useState('donations');
  const [user, setUser] = useState({ points: 0, name: '' });
  const [donations, setDonations] = useState([]);
  const [step, setStep] = useState(1);
  const [bookCategories, setBookCategories] = useState([
    { id: 1, category: '', count: 1, notes: '' }
  ]);
  const [formData, setFormData] = useState({
    selectedDate: '',
    timeSlot: '10:00 AM',
    overallNotes: ''
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('ss_current_user')) || { points: 0, name: 'User' };
    setUser(storedUser);
    
    const storedDonations = JSON.parse(localStorage.getItem('ss_donations') || '[]');
    const userDonations = storedDonations.filter(d => d.user === storedUser.name);
    setDonations(userDonations);
  }, []);

  const addCategory = () => {
    const newId = bookCategories.length > 0 ? Math.max(...bookCategories.map(c => c.id)) + 1 : 1;
    setBookCategories([...bookCategories, { id: newId, category: '', count: 1, notes: '' }]);
  };

  const removeCategory = (id) => {
    if (bookCategories.length <= 1) {
      alert('You need at least one category');
      return;
    }
    setBookCategories(bookCategories.filter(c => c.id !== id));
  };

  const updateCategory = (id, field, value) => {
    setBookCategories(bookCategories.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const getTotalBooks = () => {
    return bookCategories.reduce((sum, cat) => sum + (parseInt(cat.count) || 0), 0);
  };

  const getTotalPoints = () => {
    return bookCategories.reduce((sum, cat) => sum + (parseInt(cat.count) || 0) * 10, 0);
  };

  const nextStep = () => {
    if (step === 1) {
      const hasEmptyCategory = bookCategories.some(c => !c.category);
      if (hasEmptyCategory) {
        alert('Please select a category for all entries');
        return;
      }
    }
    if (step === 2 && !formData.selectedDate) {
      alert('Please select a drop-off date');
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalPoints = getTotalPoints();
    const allDonations = JSON.parse(localStorage.getItem('ss_donations') || '[]');
    
    // Create a donation entry for each category
    bookCategories.forEach(cat => {
      const newDonation = {
        id: 'DON-' + Math.floor(100 + Math.random() * 900) + '-' + cat.id,
        user: user.name,
        type: cat.category,
        count: parseInt(cat.count) || 0,
        notes: cat.notes || '',
        date: formData.selectedDate,
        time: formData.timeSlot,
        overallNotes: formData.overallNotes || '',
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      allDonations.push(newDonation);
    });
    
    localStorage.setItem('ss_donations', JSON.stringify(allDonations));
    
    // Update local donations list
    const updatedDonations = allDonations.filter(d => d.user === user.name);
    setDonations(updatedDonations);
    
    document.getElementById('successModal').style.display = 'flex';
    document.getElementById('finalPoints').innerText = totalPoints;
    document.getElementById('finalTotalBooks').innerText = getTotalBooks();
    
    // Reset form
    setBookCategories([{ id: 1, category: '', count: 1, notes: '' }]);
    setFormData({
      selectedDate: '',
      timeSlot: '10:00 AM',
      overallNotes: ''
    });
    setStep(1);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return '#F4A261';
      case 'Approved': return '#2A9D8F';
      case 'Rejected': return '#E76F51';
      default: return '#6C757D';
    }
  };

  const styles = {
    body: { fontFamily: 'Inter, sans-serif', backgroundColor: '#F1F3F5', color: '#343A40', paddingTop: 0 },
    mainContent: { maxWidth: 1000, margin: '40px auto', padding: '0 20px' },
    pageHeader: { marginBottom: 40, textAlign: 'center' },
    pageHeaderH1: { fontFamily: 'Playfair Display, serif', fontSize: 32, marginBottom: 10 },
    tabs: { display: 'flex', gap: 12, marginBottom: 30, justifyContent: 'center' },
    tab: { 
      padding: '12px 28px', 
      borderRadius: 12, 
      border: '2px solid #DEE2E6', 
      background: 'white', 
      cursor: 'pointer', 
      fontWeight: 600,
      transition: 'all 0.3s ease'
    },
    tabActive: { 
      background: '#1E4D4B', 
      color: 'white', 
      borderColor: '#1E4D4B' 
    },
    formCard: { background: 'white', padding: 40, borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
    stepper: { display: 'flex', justifyContent: 'space-between', marginBottom: 40, position: 'relative' },
    step: { width: 32, height: 32, borderRadius: '50%', background: 'white', border: '2px solid #DEE2E6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, zIndex: 2, color: '#6C757D' },
    stepActive: { borderColor: '#1E4D4B', background: '#1E4D4B', color: 'white' },
    formGroup: { marginBottom: 24 },
    label: { display: 'block', fontWeight: 600, marginBottom: 10 },
    formControl: { width: '100%', padding: 14, border: '2px solid #DEE2E6', borderRadius: 12, fontFamily: 'Inter, sans-serif', fontSize: 16 },
    numberInput: { display: 'flex', alignItems: 'center', gap: 10 },
    numBtn: { width: 40, height: 40, borderRadius: 8, border: '1px solid #DEE2E6', background: 'white', cursor: 'pointer', fontSize: 20 },
    formActions: { display: 'flex', justifyContent: 'space-between', marginTop: 40, borderTop: '1px solid #DEE2E6', paddingTop: 30 },
    btn: { padding: '12px 28px', borderRadius: 12, border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 },
    btnPrev: { background: '#DEE2E6', color: '#343A40' },
    btnNext: { background: '#1E4D4B', color: 'white' },
    btnSubmit: { background: '#E76F51', color: 'white' },
    btnAddDonation: { background: '#2A9D8F', color: 'white' },
    btnAddCategory: { background: '#1E4D4B', color: 'white', padding: '8px 16px', fontSize: 14 },
    btnRemoveCategory: { background: '#E76F51', color: 'white', padding: '8px 16px', fontSize: 14 },
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'none', alignItems: 'center', justifyContent: 'center' },
    modal: { background: 'white', padding: 40, borderRadius: 16, maxWidth: 500, width: '90%', textAlign: 'center' },
    pointsBox: { background: '#F1F3F5', padding: 20, borderRadius: 12, margin: '24px 0', border: '2px dashed #E9C46A' },
    donationsList: { marginTop: 20 },
    donationCard: { 
      background: 'white', 
      padding: 20, 
      borderRadius: 12, 
      marginBottom: 16, 
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      border: '1px solid #DEE2E6',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    donationInfo: { flex: 1 },
    donationStatus: { 
      padding: '6px 16px', 
      borderRadius: 20, 
      fontWeight: 600,
      fontSize: 14
    },
    emptyState: { 
      textAlign: 'center', 
      padding: '60px 20px', 
      color: '#6C757D' 
    },
    pointsSummary: { 
      background: '#E9F5F4', 
      padding: 16, 
      borderRadius: 12, 
      marginBottom: 24,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    categoryCard: {
      background: '#F8F9FA',
      padding: 20,
      borderRadius: 12,
      marginBottom: 16,
      border: '1px solid #DEE2E6',
      position: 'relative'
    },
    categoryHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16
    },
    categoryTitle: {
      fontWeight: 600,
      color: '#1E4D4B'
    },
    categoryActions: {
      display: 'flex',
      gap: 8
    },
    totalSummary: {
      background: '#F1F3F5',
      padding: 16,
      borderRadius: 12,
      marginTop: 20,
      display: 'flex',
      justifyContent: 'space-around',
      border: '2px solid #DEE2E6'
    }
  };

  const totalBooks = getTotalBooks();
  const totalPoints = getTotalPoints();

  return (
    <div style={styles.body}>
      <Navbar variant="user" user={user} />

      <main style={styles.mainContent}>
        <div style={styles.pageHeader}>
          <h1 style={styles.pageHeaderH1}>My Donations</h1>
          <p>Track your donations and contribute to the community.</p>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button 
            style={{ ...styles.tab, ...(activeTab === 'donations' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('donations')}
          >
            My Donations ({donations.length})
          </button>
          <button 
            style={{ ...styles.tab, ...(activeTab === 'add' ? styles.tabActive : {}) }}
            onClick={() => {
              setActiveTab('add');
              setStep(1);
            }}
          >
            + Add Donation
          </button>
        </div>

        {/* Donations List Tab */}
        {activeTab === 'donations' && (
          <div style={styles.formCard}>
            <div style={styles.pointsSummary}>
              <span><strong>Total Donations:</strong> {donations.length}</span>
              <span><strong>Total Points Earned:</strong> {donations.reduce((sum, d) => sum + (d.count * 10), 0)} pts</span>
              <span><strong>Total Books:</strong> {donations.reduce((sum, d) => sum + d.count, 0)}</span>
            </div>

            {donations.length === 0 ? (
              <div style={styles.emptyState}>
                <i className="fa-solid fa-book" style={{ fontSize: 48, color: '#DEE2E6', marginBottom: 16 }}></i>
                <h3>No donations yet</h3>
                <p style={{ marginTop: 8 }}>Start your first donation by clicking the "Add Donation" tab above.</p>
                <button 
                  style={{ ...styles.btn, ...styles.btnAddDonation, marginTop: 20 }}
                  onClick={() => setActiveTab('add')}
                >
                  Make Your First Donation
                </button>
              </div>
            ) : (
              <div style={styles.donationsList}>
                {donations.map((donation) => (
                  <div key={donation.id} style={styles.donationCard}>
                    <div style={styles.donationInfo}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                        <strong>{donation.type}</strong>
                        <span style={{ fontSize: 14, color: '#6C757D' }}>• {donation.count} books</span>
                        {donation.notes && (
                          <span style={{ fontSize: 12, color: '#6C757D', fontStyle: 'italic' }}>📝 {donation.notes}</span>
                        )}
                      </div>
                      <div style={{ fontSize: 14, color: '#6C757D' }}>
                        <span>📅 {donation.date} at {donation.time}</span>
                        <span style={{ marginLeft: 16 }}>🆔 {donation.id}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span style={{ 
                        ...styles.donationStatus, 
                        background: getStatusColor(donation.status) + '20',
                        color: getStatusColor(donation.status)
                      }}>
                        {donation.status}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#2A9D8F' }}>
                        +{donation.count * 10} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Donation Tab */}
        {activeTab === 'add' && (
          <div style={styles.formCard}>
            <div style={styles.stepper}>
              <div style={{ ...styles.step, ...(step >= 1 ? styles.stepActive : {}) }}>1</div>
              <div style={{ ...styles.step, ...(step >= 2 ? styles.stepActive : {}) }}>2</div>
              <div style={{ ...styles.step, ...(step >= 3 ? styles.stepActive : {}) }}>3</div>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div>
                  <h3 style={{ marginBottom: 20 }}>Step 1: What are you donating?</h3>
                  
                  {bookCategories.map((cat, index) => (
                    <div key={cat.id} style={styles.categoryCard}>
                      <div style={styles.categoryHeader}>
                        <span style={styles.categoryTitle}>Category {index + 1}</span>
                        <div style={styles.categoryActions}>
                          {index > 0 && (
                            <button 
                              type="button" 
                              style={{ ...styles.btn, ...styles.btnRemoveCategory }}
                              onClick={() => removeCategory(cat.id)}
                            >
                              <i className="fa-solid fa-trash"></i> Remove
                            </button>
                          )}
                        </div>
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Book Category</label>
                        <select 
                          style={styles.formControl} 
                          value={cat.category} 
                          onChange={(e) => updateCategory(cat.id, 'category', e.target.value)} 
                          required
                        >
                          <option value="">Select a category...</option>
                          <option value="Fiction">Fiction (Novels, Fantasy, Mystery)</option>
                          <option value="Non-Fiction">Non-Fiction (Biographies, History)</option>
                          <option value="Academic">Academic (Textbooks, Reference)</option>
                          <option value="Children">Children's Books</option>
                          <option value="Comics">Comics & Manga</option>
                          <option value="Mixed">Mixed Collection</option>
                        </select>
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Number of Books</label>
                        <div style={styles.numberInput}>
                          <button type="button" style={styles.numBtn} onClick={() => {
                            const newCount = Math.max(1, (parseInt(cat.count) || 1) - 1);
                            updateCategory(cat.id, 'count', newCount);
                          }}>-</button>
                          <input 
                            type="number" 
                            style={{ ...styles.formControl, textAlign: 'center', width: 100 }} 
                            value={cat.count} 
                            onChange={(e) => updateCategory(cat.id, 'count', parseInt(e.target.value) || 1)} 
                            min="1" 
                            max="100" 
                          />
                          <button type="button" style={styles.numBtn} onClick={() => {
                            const newCount = Math.min(100, (parseInt(cat.count) || 1) + 1);
                            updateCategory(cat.id, 'count', newCount);
                          }}>+</button>
                        </div>
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Notes for this category (Optional)</label>
                        <input 
                          type="text" 
                          style={styles.formControl} 
                          placeholder="e.g., 3 novels, 2 textbooks in good condition..." 
                          value={cat.notes} 
                          onChange={(e) => updateCategory(cat.id, 'notes', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}

                  <button 
                    type="button" 
                    style={{ ...styles.btn, ...styles.btnAddCategory }}
                    onClick={addCategory}
                  >
                    <i className="fa-solid fa-plus"></i> Add Another Category
                  </button>

                  <div style={styles.totalSummary}>
                    <span><strong>Total Categories:</strong> {bookCategories.length}</span>
                    <span><strong>Total Books:</strong> {totalBooks}</span>
                    <span><strong>Estimated Points:</strong> {totalPoints} pts</span>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 style={{ marginBottom: 20 }}>Step 2: Pick a drop-off date</h3>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Drop-off Date</label>
                    <input 
                      type="date" 
                      style={styles.formControl} 
                      value={formData.selectedDate} 
                      onChange={(e) => setFormData(prev => ({ ...prev, selectedDate: e.target.value }))} 
                      required 
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Preferred Time Slot</label>
                    <select 
                      style={styles.formControl} 
                      value={formData.timeSlot} 
                      onChange={(e) => setFormData(prev => ({ ...prev, timeSlot: e.target.value }))} 
                      required
                    >
                      <option value="10:00 AM">Morning (10:00 AM - 12:00 PM)</option>
                      <option value="02:00 PM">Afternoon (02:00 PM - 04:00 PM)</option>
                      <option value="05:00 PM">Evening (05:00 PM - 07:00 PM)</option>
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Overall Notes (Optional)</label>
                    <textarea 
                      style={styles.formControl} 
                      rows="3" 
                      placeholder="Any additional information about your donation..." 
                      value={formData.overallNotes} 
                      onChange={(e) => setFormData(prev => ({ ...prev, overallNotes: e.target.value }))}
                    ></textarea>
                  </div>

                  <div style={styles.totalSummary}>
                    <span><strong>Categories:</strong> {bookCategories.length}</span>
                    <span><strong>Total Books:</strong> {totalBooks}</span>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 style={{ marginBottom: 20 }}>Step 3: Review & Confirm</h3>
                  
                  <div style={{ background: '#F1F3F5', padding: 20, borderRadius: 12 }}>
                    <h4 style={{ marginBottom: 16 }}>Donation Summary</h4>
                    
                    {bookCategories.map((cat, index) => (
                      <div key={cat.id} style={{ 
                        padding: 12, 
                        borderBottom: index < bookCategories.length - 1 ? '1px solid #DEE2E6' : 'none',
                        marginBottom: index < bookCategories.length - 1 ? 12 : 0
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span><strong>{cat.category || 'Uncategorized'}</strong></span>
                          <span>{cat.count} books = <strong>{parseInt(cat.count) * 10} pts</strong></span>
                        </div>
                        {cat.notes && (
                          <div style={{ fontSize: 13, color: '#6C757D' }}>📝 {cat.notes}</div>
                        )}
                      </div>
                    ))}
                    
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: '2px solid #DEE2E6' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span>Drop-off Date:</span>
                        <strong>{formData.selectedDate || '-'}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span>Time Slot:</span>
                        <strong>{formData.timeSlot}</strong>
                      </div>
                      {formData.overallNotes && (
                        <div style={{ fontSize: 13, color: '#6C757D', marginTop: 8 }}>
                          📝 Overall: {formData.overallNotes}
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 18 }}>
                        <span><strong>Total Books:</strong></span>
                        <span><strong style={{ color: '#1E4D4B' }}>{totalBooks} books</strong></span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18 }}>
                        <span><strong>Total Estimated Points:</strong></span>
                        <span><strong style={{ color: '#2A9D8F' }}>{totalPoints} pts</strong></span>
                      </div>
                    </div>
                  </div>
                  
                  <p style={{ fontSize: 13, color: '#6C757D', marginTop: 16 }}>
                    <i className="fa-solid fa-circle-info"></i> Points will be credited to your account after our staff verifies the condition and count of books at the collection center.
                  </p>
                </div>
              )}

              <div style={styles.formActions}>
                {step > 1 && <button type="button" style={{ ...styles.btn, ...styles.btnPrev }} onClick={prevStep}>Back</button>}
                {step < 3 && <button type="button" style={{ ...styles.btn, ...styles.btnNext }} onClick={nextStep}>Next <i className="fa-solid fa-arrow-right"></i></button>}
                {step === 3 && <button type="submit" style={{ ...styles.btn, ...styles.btnSubmit }}>Confirm Donation</button>}
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Success Modal */}
      <div id="successModal" style={styles.modalOverlay}>
        <div style={styles.modal}>
          <i className="fa-solid fa-circle-check" style={{ fontSize: 64, color: '#2A9D8F', marginBottom: 20 }}></i>
          <h2>Donation Scheduled!</h2>
          <p>Thank you for contributing to the ShareShelf community.</p>
          <div style={styles.pointsBox}>
            <div><strong>Total Books Donated:</strong> <span id="finalTotalBooks" style={{ fontSize: 24, fontWeight: 700, color: '#1E4D4B' }}>0</span></div>
            <div style={{ marginTop: 8 }}>Estimated points to earn:</div>
            <span id="finalPoints" style={{ fontSize: 32, fontWeight: 800, color: '#1E4D4B' }}>0</span> pts
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
            <button style={{ ...styles.btn, ...styles.btnNext }} onClick={() => {
              document.getElementById('successModal').style.display = 'none';
              setActiveTab('donations');
            }}>
              View My Donations
            </button>
            <button style={{ ...styles.btn, ...styles.btnAddDonation }} onClick={() => {
              document.getElementById('successModal').style.display = 'none';
              window.location.href = '/user-dashboard';
            }}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;