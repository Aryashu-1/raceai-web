"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Edit,
  Save,
  X,
  Github,
  ExternalLink,
  BookOpen,
  Award,
  MapPin,
  GraduationCap,
  Mail,
  Calendar,
} from "lucide-react";
import NavigationSidebar from "@/components/navigation-sidebar";
import { CursiveRLogo } from "@/components/cursive-r-logo";

export default function ProfilePage() {
  const [user] = useState({
    fullName: "Meghana",
    firstName: "Meghana",
    lastName: "",
    imageUrl: "/professional-researcher-avatar.png",
    primaryEmailAddress: { emailAddress: "mrbhat@usc.edu" },
    institution: "USC",
    role: "Researcher",
    researchFocus: "Machine Learning",
    joinedDate: "2024",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    researchInterests: [
      "Machine Learning",
      "Artificial Intelligence",
      "Neural Networks",
      "Computer Vision",
    ],
    hIndex: "12",
    googleScholar: "https://scholar.google.com/citations?user=example",
    github: "https://github.com/meghana",
    orcid: "0000-0000-0000-0000",
    institution: "University of Southern California",
    department: "Computer Science",
    bio: "Passionate researcher focused on advancing machine learning techniques and their applications in real-world scenarios. Currently exploring neural architecture search and computer vision applications.",
    publications: "28",
    citations: "847",
    currentProjects: [
      "Neural Architecture Optimization",
      "Computer Vision for Healthcare",
      "Federated Learning Systems",
    ],
  });

  const handleSave = () => {
    // Here you would save the data to your backend
    setIsEditing(false);
  };

  const addResearchInterest = (interest: string) => {
    if (interest && !profileData.researchInterests.includes(interest)) {
      setProfileData({
        ...profileData,
        researchInterests: [...profileData.researchInterests, interest],
      });
    }
  };

  const removeResearchInterest = (interest: string) => {
    setProfileData({
      ...profileData,
      researchInterests: profileData.researchInterests.filter(
        (i) => i !== interest
      ),
    });
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <NavigationSidebar />

      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-6">
          <div className="mb-8 flex items-center gap-4">
            <CursiveRLogo size={48} />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Research Profile
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage your academic profile and research interests
              </p>
            </div>
          </div>

          <Card className="mb-8 overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50">
            <div className="relative h-32 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
            </div>

            <CardContent className="relative -mt-16 pb-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white dark:border-slate-800 shadow-xl">
                    <AvatarImage
                      src={user.imageUrl || "/placeholder.svg"}
                      alt={user.fullName}
                    />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {user.firstName?.[0]}
                      {user.lastName?.[0] || "R"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                        {user.fullName}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-2">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {user.primaryEmailAddress.emailAddress}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {profileData.institution}
                        </div>
                        <div className="flex items-center gap-1">
                          <GraduationCap className="w-4 h-4" />
                          {user.role}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Joined {user.joinedDate}
                        </div>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-sm">
                        {profileData.department}
                      </p>
                    </div>
                    <Button
                      onClick={() =>
                        isEditing ? handleSave() : setIsEditing(true)
                      }
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isEditing ? <Save size={16} /> : <Edit size={16} />}
                      <span className="ml-2">
                        {isEditing ? "Save Changes" : "Edit Profile"}
                      </span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white/60 dark:bg-slate-700/60 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-600/50">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        {profileData.hIndex}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        H-Index
                      </div>
                    </div>
                    <div className="text-center p-4 bg-white/60 dark:bg-slate-700/60 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-600/50">
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                        {profileData.publications}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        Publications
                      </div>
                    </div>
                    <div className="text-center p-4 bg-white/60 dark:bg-slate-700/60 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-600/50">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                        {profileData.citations}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        Citations
                      </div>
                    </div>
                    <div className="text-center p-4 bg-white/60 dark:bg-slate-700/60 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-600/50">
                      <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                        {profileData.currentProjects.length}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        Active Projects
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-slate-900 dark:text-white">
                  <BookOpen className="mr-3 w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Research Interests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profileData.researchInterests.map((interest, index) => (
                    <Badge
                      key={index}
                      className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-2 px-3 py-1"
                    >
                      {interest}
                      {isEditing && (
                        <X
                          size={14}
                          className="cursor-pointer hover:text-red-500 transition-colors"
                          onClick={() => removeResearchInterest(interest)}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <Input
                    placeholder="Add research interest (press Enter)"
                    className="bg-white/80 dark:bg-slate-700/80 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addResearchInterest(e.currentTarget.value);
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-slate-900 dark:text-white">
                  <ExternalLink className="mr-3 w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Academic Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Google Scholar
                  </label>
                  {isEditing ? (
                    <Input
                      value={profileData.googleScholar}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          googleScholar: e.target.value,
                        })
                      }
                      placeholder="Google Scholar URL"
                      className="bg-white/80 dark:bg-slate-700/80 border-slate-300 dark:border-slate-600"
                    />
                  ) : (
                    <a
                      href={profileData.googleScholar}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      <Award size={16} className="mr-2" />
                      View Scholar Profile
                    </a>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    GitHub
                  </label>
                  {isEditing ? (
                    <Input
                      value={profileData.github}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          github: e.target.value,
                        })
                      }
                      placeholder="GitHub URL"
                      className="bg-white/80 dark:bg-slate-700/80 border-slate-300 dark:border-slate-600"
                    />
                  ) : (
                    <a
                      href={profileData.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      <Github size={16} className="mr-2" />
                      View GitHub Profile
                    </a>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    ORCID
                  </label>
                  {isEditing ? (
                    <Input
                      value={profileData.orcid}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          orcid: e.target.value,
                        })
                      }
                      placeholder="ORCID ID"
                      className="bg-white/80 dark:bg-slate-700/80 border-slate-300 dark:border-slate-600"
                    />
                  ) : (
                    <p className="text-slate-600 dark:text-slate-400 font-mono text-sm">
                      {profileData.orcid}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-slate-900 dark:text-white">
                  <Award className="mr-3 w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Current Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profileData.currentProjects.map((project, index) => (
                    <div
                      key={index}
                      className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600"
                    >
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {project}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          Active
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Biography */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-slate-900 dark:text-white">
                  Biography
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    placeholder="Tell us about your research background and interests..."
                    rows={4}
                    className="bg-white/80 dark:bg-slate-700/80 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                  />
                ) : (
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {profileData.bio}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
