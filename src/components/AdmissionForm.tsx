import React, { useState } from 'react';
import { AdmissionApplication } from '../types';
import { CheckCircle2, User, Users, MapPin, Phone, Mail, Award, ArrowLeft, Printer, AlertCircle } from 'lucide-react';

interface AdmissionFormProps {
  onSubmit: (app: Omit<AdmissionApplication, 'id' | 'submittedAt' | 'status'>) => void;
  classes: string[];
}

export default function AdmissionForm({ onSubmit, classes }: AdmissionFormProps) {
  const [formData, setFormData] = useState({
    studentNameBn: '',
    studentNameEn: '',
    dateOfBirth: '',
    gender: 'Male',
    classApplied: 'Play',
    prevSchool: '',
    bloodGroup: '',
    
    guardianName: '',
    guardianRelation: 'Father',
    guardianNID: '',
    guardianOccupation: '',
    phoneNumber: '',
    email: '',
    presentAddress: '',
    permanentAddress: '',
    sameAsPresent: false,
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // If sameAsPresent is true, copy present address to permanent address
      if (name === 'presentAddress' && prev.sameAsPresent) {
        updated.permanentAddress = value;
      }
      return updated;
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      sameAsPresent: checked,
      permanentAddress: checked ? prev.presentAddress : prev.permanentAddress
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Call parents trigger
    onSubmit(formData);
    
    // Save state for receipt
    setReceiptData({
      ...formData,
      id: 'ASK-' + Math.floor(100000 + Math.random() * 900000),
      submittedAt: new Date().toLocaleString('bn-BD', { hour12: true }),
    });
    
    setIsSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setFormData({
      studentNameBn: '',
      studentNameEn: '',
      dateOfBirth: '',
      gender: 'Male',
      classApplied: 'Play',
      prevSchool: '',
      bloodGroup: '',
      guardianName: '',
      guardianRelation: 'Father',
      guardianNID: '',
      guardianOccupation: '',
      phoneNumber: '',
      email: '',
      presentAddress: '',
      permanentAddress: '',
      sameAsPresent: false,
    });
    setIsSuccess(false);
    setReceiptData(null);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isSuccess && receiptData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-green-500 overflow-hidden print-section">
          
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white text-center">
            <CheckCircle2 className="mx-auto text-white mb-2 animate-bounce" size={48} />
            <h3 className="text-2xl font-black font-sans">আবেদনটি সফলভাবে জমা হয়েছে!</h3>
            <p className="text-green-100 text-sm mt-1">ভর্তি কার্যক্রম পর্যালোচনার জন্য আপনার আবেদনটি সংরক্ষণ করুন।</p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Header / Receipt details */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">রসিদ নম্বর / ID</p>
                <p className="text-xl font-mono font-bold text-blue-900">{receiptData.id}</p>
              </div>
              <div className="mt-2 sm:mt-0 text-left sm:text-right">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">আবেদনের সময়</p>
                <p className="text-sm font-medium text-gray-700">{receiptData.submittedAt}</p>
              </div>
            </div>

            {/* Student Info Summary */}
            <div>
              <h4 className="text-sm font-black text-blue-950 uppercase tracking-wider mb-3 flex items-center space-x-1.5 border-b border-gray-100 pb-1">
                <User size={16} className="text-blue-900" />
                <span>শিক্ষার্থীর বিবরণী</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">শিক্ষার্থীর নাম (বাংলা):</span>
                  <p className="font-bold text-gray-800">{receiptData.studentNameBn}</p>
                </div>
                <div>
                  <span className="text-gray-500">শিক্ষার্থীর নাম (English):</span>
                  <p className="font-bold text-gray-800">{receiptData.studentNameEn}</p>
                </div>
                <div>
                  <span className="text-gray-500">শ্রেণী:</span>
                  <p className="font-bold text-blue-800">{receiptData.classApplied}</p>
                </div>
                <div>
                  <span className="text-gray-500">জন্ম তারিখ:</span>
                  <p className="font-bold text-gray-800">{receiptData.dateOfBirth}</p>
                </div>
                <div>
                  <span className="text-gray-500">লিঙ্গ:</span>
                  <p className="font-bold text-gray-800">{receiptData.gender === 'Male' ? 'ছাত্র' : 'ছাত্রী'}</p>
                </div>
                <div>
                  <span className="text-gray-500">রক্তের গ্রুপ:</span>
                  <p className="font-bold text-gray-800">{receiptData.bloodGroup || 'উল্লেখ নেই'}</p>
                </div>
              </div>
            </div>

            {/* Guardian Info Summary */}
            <div>
              <h4 className="text-sm font-black text-blue-950 uppercase tracking-wider mb-3 flex items-center space-x-1.5 border-b border-gray-100 pb-1">
                <Users size={16} className="text-blue-900" />
                <span>অভিভাবকের বিবরণী</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">অভিভাবকের নাম:</span>
                  <p className="font-bold text-gray-800">{receiptData.guardianName} ({receiptData.guardianRelation === 'Father' ? 'পিতা' : receiptData.guardianRelation === 'Mother' ? 'মাতা' : 'অন্যান্য'})</p>
                </div>
                <div>
                  <span className="text-gray-500">এনআইডি নম্বর (NID):</span>
                  <p className="font-bold text-gray-800">{receiptData.guardianNID}</p>
                </div>
                <div>
                  <span className="text-gray-500">মোবাইল নম্বর:</span>
                  <p className="font-bold text-gray-800">{receiptData.phoneNumber}</p>
                </div>
                <div>
                  <span className="text-gray-500">বর্তমান ঠিকানা:</span>
                  <p className="font-bold text-gray-800">{receiptData.presentAddress}</p>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="p-4 bg-blue-50 text-blue-900 rounded-xl text-xs space-y-1">
              <p className="font-bold">গুরুত্বপূর্ণ নির্দেশনা:</p>
              <p>১. আবেদন কপিটি প্রিন্ট করে আপনার কাছে সংরক্ষণ করুন।</p>
              <p>২. আগামী ৫ কার্যদিবসের মধ্যে আপনার আবেদন যাচাই করে মোবাইল নাম্বারে চূড়ান্ত নির্দেশনা পাঠানো হবে।</p>
              <p>৩. ভর্তির জন্য জন্ম নিবন্ধন, অভিভাবকের জাতীয় পরিচয়পত্র ও পাসপোর্ট সাইজের ছবির প্রয়োজন হবে।</p>
              <p className="font-bold text-amber-900 bg-amber-100 p-2 rounded mt-1">৪. ওয়েবসাইটে আবেদন করার পর স্কুলে গিয়ে সকল ফি প্রদান সম্পন্ন করে ভর্তি নিশ্চিত করতে হবে।</p>
            </div>

            {/* Receipt Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100 no-print">
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm transition-colors"
              >
                <Printer size={16} />
                <span>রসিদ প্রিন্ট করুন</span>
              </button>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
              >
                <ArrowLeft size={16} />
                <span>নতুন আবেদন করুন</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl sm:text-3xl font-black text-blue-950 font-sans">অনলাইন ভর্তি আবেদন ফরম</h3>
        <p className="text-gray-500 text-sm mt-1">আদর্শ শিশু কানন স্কুলে ২০২৬ শিক্ষাবর্ষে ভর্তির জন্য সঠিক তথ্য দিয়ে ফরমটি পূরণ করুন।</p>
        <div className="w-16 h-1 bg-amber-500 mx-auto mt-3 rounded-full"></div>
      </div>

      {/* Important Instruction Notice Box */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl text-amber-900 text-xs sm:text-sm font-semibold mb-6 flex items-start space-x-3 shadow-sm">
        <AlertCircle className="shrink-0 text-amber-600 mt-0.5" size={20} />
        <div>
          <span className="font-bold block text-amber-950 mb-0.5">গুরুত্বপূর্ণ নোটিশ:</span>
          <span>ওয়েবসাইটে আবেদন করার পর স্কুলে গিয়ে সকল ফি প্রদান সম্পন্ন করে ভর্তি নিশ্চিত করতে হবে।</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        
        {/* STEP 1: Student Information */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <div className="p-1.5 bg-blue-100 text-blue-900 rounded-lg">
              <User size={18} />
            </div>
            <h4 className="text-lg font-bold text-blue-950">১. শিক্ষার্থীর ব্যক্তিগত তথ্য</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Bengali Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">শিক্ষার্থীর নাম (বাংলায়) <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="studentNameBn"
                required
                value={formData.studentNameBn}
                onChange={handleInputChange}
                placeholder="যেমন: তাসনিম রহমান"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            {/* English Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">শিক্ষার্থীর নাম (English) <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="studentNameEn"
                required
                value={formData.studentNameEn}
                onChange={handleInputChange}
                placeholder="e.g. Tasnim Rahman"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            {/* DOB */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">জন্ম তারিখ <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="dateOfBirth"
                required
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">লিঙ্গ <span className="text-red-500">*</span></label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Male">ছাত্র (Male)</option>
                <option value="Female">ছাত্রী (Female)</option>
                <option value="Other">অন্যান্য (Other)</option>
              </select>
            </div>

            {/* Class Applied */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">যে শ্রেণীতে ভর্তি হতে ইচ্ছুক <span className="text-red-500">*</span></label>
              <select
                name="classApplied"
                value={formData.classApplied}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {classes.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">রক্তের গ্রুপ (যদি জানা থাকে)</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">নির্বাচন করুন</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            {/* Prev School */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">পূর্ববর্তী শিক্ষা প্রতিষ্ঠানের নাম (যদি থাকে)</label>
              <input
                type="text"
                name="prevSchool"
                value={formData.prevSchool}
                onChange={handleInputChange}
                placeholder="যেমন: ধুবনী সরকারি প্রাথমিক বিদ্যালয়"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* STEP 2: Guardian Information */}
        <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100 space-y-6">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
            <div className="p-1.5 bg-blue-100 text-blue-900 rounded-lg">
              <Users size={18} />
            </div>
            <h4 className="text-lg font-bold text-blue-950">২. অভিভাবকের তথ্য</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Guardian Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">অভিভাবকের নাম <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="guardianName"
                required
                value={formData.guardianName}
                onChange={handleInputChange}
                placeholder="যেমন: মোঃ মতিয়ার ভূঁইয়া"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            {/* Relation */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">শিক্ষার্থীর সাথে সম্পর্ক <span className="text-red-500">*</span></label>
              <select
                name="guardianRelation"
                value={formData.guardianRelation}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Father">পিতা (Father)</option>
                <option value="Mother">মাতা (Mother)</option>
                <option value="Other">অন্যান্য (Other)</option>
              </select>
            </div>

            {/* NID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">জাতীয় পরিচয়পত্র নম্বর (NID) <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="guardianNID"
                required
                value={formData.guardianNID}
                onChange={handleInputChange}
                placeholder="যেমন: ১২৩৪৫৬৭৮৯০"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">পেশা <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="guardianOccupation"
                required
                value={formData.guardianOccupation}
                onChange={handleInputChange}
                placeholder="যেমন: চাকুরিজীবী / ব্যবসায়ী / কৃষক"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">যোগাযোগের মোবাইল নাম্বার <span className="text-red-500">*</span></label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="যেমন: ০১৭১১-২২৩৩৪৪"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">ইমেইল এড্রেস (ঐচ্ছিক)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. guardian@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* STEP 3: Addresses */}
        <div className="p-6 sm:p-8 border-t border-slate-200 space-y-6">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <div className="p-1.5 bg-blue-100 text-blue-900 rounded-lg">
              <MapPin size={18} />
            </div>
            <h4 className="text-lg font-bold text-blue-950">৩. যোগাযোগের ঠিকানা</h4>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {/* Present Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">বর্তমান ঠিকানা <span className="text-red-500">*</span></label>
              <textarea
                name="presentAddress"
                required
                value={formData.presentAddress}
                onChange={handleInputChange}
                rows={2}
                placeholder="গ্রাম, ডাকঘর, উপজেলা ও জেলা উল্লেখ করুন"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            {/* Checkbox same as present */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="sameAsPresent"
                checked={formData.sameAsPresent}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="sameAsPresent" className="text-sm font-medium text-gray-600 cursor-pointer select-none">বর্তমান ও স্থায়ী ঠিকানা একই</label>
            </div>

            {/* Permanent Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">স্থায়ী ঠিকানা <span className="text-red-500">*</span></label>
              <textarea
                name="permanentAddress"
                required
                disabled={formData.sameAsPresent}
                value={formData.permanentAddress}
                onChange={handleInputChange}
                rows={2}
                placeholder="গ্রাম, ডাকঘর, উপজেলা ও জেলা উল্লেখ করুন"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 bg-white hover:bg-slate-50 border border-gray-300 text-gray-700 font-bold rounded-lg cursor-pointer transition-colors"
          >
            পুনরায় লিখুন
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            আবেদন জমা দিন
          </button>
        </div>

      </form>
    </div>
  );
}
