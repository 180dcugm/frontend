import React, { useState } from "react";
import { Button } from "@/components/elements/Form/button";
import { Input } from "@/components/elements/Form/input";
import { Label } from "@/components/elements/Form/label";
import { ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/elements/Form/checkbox";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/elements/Form/select";

const Slide1 = ({ formData, updateFormData, onNext }) => {
  const [name, setName] = useState(formData.name || "");
  const [email, setEmail] = useState(formData.email || "");
  const [batch, setBatch] = useState(formData.batch || "");
  const [phone, setPhone] = useState(formData.phone || "");
  const [faculty, setFaculty] = useState(formData.faculty || "");
  const [major, setMajor] = useState(formData.major || "");
  const [gpa, setGpa] = useState(formData.gpa || "");
  const [activeStudent, setActiveStudent] = useState(formData.activeStudent || false);

  const handleNext = () => {
    // Check if user is not an active student
    if (!activeStudent) {
      updateFormData({
        name,
        email,
        batch,
        phone,
        faculty,
        major,
        gpa,
        activeStudent: false,
      });
      return;
    }

    // If active student, proceed normally to Slide 2
    updateFormData({
      name,
      email,
      batch,
      phone,
      faculty,
      major,
      gpa,
      activeStudent,
    });
    onNext();
  };

  const isValid =
    name.trim() &&
    email.trim() &&
    email.includes("@") &&
    batch.trim() &&
    phone.trim() &&
    faculty.trim() &&
    major.trim() &&
    gpa.trim() &&
    parseFloat(gpa) >= 0 &&
    parseFloat(gpa) <= 100 &&
    activeStudent;

  return (
    <div className="abatchate-fade-in space-y-6">
      <div className="text-center">
        <h2 className="font-avenir-black mt-2 mb-1 text-2xl leading-snug text-green-300 lg:text-3xl">
          180 DC Consulting Analyst Recruitment.
        </h2>
        <p className="font-lato-regular text-gray-600">
          Start your journey by get knowing more about 180DC UGM
        </p>
      </div>

      {/* Prerequisites */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
        <h3 className="font-avenir-black mb-6 flex items-center gap-2 text-xl text-gray-800">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-300">
            <span className="text-sm font-bold text-white">1</span>
          </div>
          About 180DC UGM
        </h3>

        <div className="mb-4">
          <h2 className="font-avenir-regular font-bold">Our Mission and Vision</h2>
          <p className="font-lato-regular text-gray-600">
            180 Degrees Consulting is the world’s largest volunteer-led consultancy for non-profits
            and social enterprises. With over 150 branches across 35+ countries and over 10.000
            consultants.
            <br />
            <br />
            ⭐️ We are committed to give back to society and deliver excellent standards in
            everything we do, as illustrated by our university motto to be “Locally Rooted, Globally
            Respected”.
            <br />
            <br />
            ⭐️ We are here to help Non-Profit Organizations, Non-Governmental Organizations, and
            SMEs by providing pro-bono consulting services from a qualified and trained student. We
            do what we do because we believe in effective charity, and because we believe in
            developing the next generation of social impact leaders.
            <br />
            <br />
            ⭐️ We highly value our #CloSER value that consist of Collaborative, Socially Driven,
            Excellent and Responsible within our respective members
            <br />
            <br />
            We are very thrilled to welcome you in this process, and hope you find meaningful
            lessons throughout the journey 🏆 We wish you the best of luck!
          </p>
        </div>

        <div className="mb-4">
          <h2 className="font-avenir-regular font-bold">Recruitment Booklet</h2>
          <p className="font-lato-regular text-gray-600">
            We advise you to read through the booklet first before filling out the form!
          </p>
          <Link href="/file/CAOprecGuidebook.pdf" target="blank" className="hover:text-green-300">
            <p className="font-lato-bold underline">Read Booklet</p>
          </Link>
        </div>
      </div>

      {/* Personal Information Form */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
        <h3 className="font-avenir-black mb-6 flex items-center gap-2 text-xl text-gray-800">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-300">
            <span className="text-sm font-bold text-white">2</span>
          </div>
          Personal Information
        </h3>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label
              htmlFor="name"
              className="font-avenir-regular mb-2 block text-sm font-medium text-gray-700"
            >
              Full Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name as registered in UGM"
              className="font-lato-regular border-gray-300 transition-all duration-200 focus:ring-2 focus:ring-green-300/50"
            />
          </div>

          <div>
            <Label
              htmlFor="email"
              className="font-avenir-regular mb-2 block text-sm font-medium text-gray-700"
            >
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@mail.ugm.ac.id"
              className="font-lato-regular border-gray-300 transition-all duration-200 focus:ring-2 focus:ring-green-300/50"
            />
          </div>

          <div>
            <Label
              htmlFor="batch"
              className="font-avenir-regular mb-2 block text-sm font-medium text-gray-700"
            >
              Student ID (batch) *
            </Label>
            <Select
              value={batch}
              onValueChange={(value) => {
                setBatch(value);
                updateFormData({ batch: value });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="phone"
              className="font-avenir-regular mb-2 block text-sm font-medium text-gray-700"
            >
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="62 8xx-xxxx-xxxx"
              className="font-lato-regular border-gray-300 transition-all duration-200 focus:ring-2 focus:ring-green-300/50"
            />
          </div>

          <div>
            <Label
              htmlFor="faculty"
              className="font-avenir-regular mb-2 block text-sm font-medium text-gray-700"
            >
              Faculty *
            </Label>
            <Input
              id="faculty"
              type="text"
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              placeholder="e.g., Faculty of Economics and Business"
              className="font-lato-regular border-gray-300 transition-all duration-200 focus:ring-2 focus:ring-green-300/50"
            />
          </div>

          <div>
            <Label
              htmlFor="major"
              className="font-avenir-regular mb-2 block text-sm font-medium text-gray-700"
            >
              Faculty_Major *
            </Label>
            <Input
              id="major"
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="e.g., FEB_Management"
              className="font-lato-regular border-gray-300 transition-all duration-200 focus:ring-2 focus:ring-green-300/50"
            />
          </div>
          <div>
            <Label
              htmlFor="gpa"
              className="font-avenir-regular mb-2 block text-sm font-medium text-gray-700"
            >
              Current GPA *
            </Label>
            <Input
              id="gpa"
              type="text"
              value={gpa}
              onChange={(e) => setGpa(e.target.value)}
              placeholder="e.g., 3.99"
              className="font-lato-regular border-gray-300 transition-all duration-200 focus:ring-2 focus:ring-green-300/50"
            />
            <p className="font-lato-regular mt-2 text-sm text-gray-500">
              If you have not received your IPK, you may use your IPS instead. For batch 2026
              students, please use your final average high school grade.
              <br />
              Please use a period (.) as the decimal separator.
              <br />
              e.g. 3.99
            </p>
          </div>
        </div>
        <div className="mb-4 flex flex-col gap-2">
          <h2 className="font-avenir-regular font-bold">Are you an active UGM student?</h2>
          <div className="flex flex-row items-center gap-2">
            <Checkbox
              id="activeStudent"
              checked={activeStudent}
              onCheckedChange={(checked) => setActiveStudent(checked)}
              className="text-white"
            />
            <Label>
              <p className="font-lato-regular text-gray-600">
                By checking this box, I hereby declare that I am an active UGM student
              </p>
            </Label>
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleNext}
          disabled={!isValid}
          className="font-avenir-regular disabled:text-black-300 flex items-center gap-2 bg-green-300 text-white transition-all duration-200 hover:scale-105 hover:bg-green-300/90 disabled:opacity-50 disabled:hover:scale-100"
        >
          {!activeStudent && isValid ? "Submit (Non-Active Student)" : "Continue to Next Step"}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Slide1;
