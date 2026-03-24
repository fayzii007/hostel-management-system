import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [student, setStudent]   = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading]   = useState(true);

  // 📝 Debug Logs
  const log = (msg, data = '') => console.log(`[AuthSystem] ${msg}`, data);

  const fetchProfile = async (uid) => {
    try {
      log('Fetching DB Profile for:', uid);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('auth_user_id', uid)
        .maybeSingle();
      
      if (!error && data) {
        log('DB Profile found:', data.full_name);
        setStudent(data);
      } else {
        log('No DB Profile yet. Waiting for trigger...');
        setStudent(null);
      }
    } catch (e) {
      log('Profile fetch crashed:', e.message);
    }
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        log('Initializing session...');
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          if (session?.user) {
            setAuthUser(session.user);
            await fetchProfile(session.user.id);
          }
        }
      } catch (err) {
        log('Init error:', err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        log(`Auth Event: ${event}`);
        if (!mounted) return;

        if (session?.user) {
          setAuthUser(session.user);
          // Don't wait on the profile fetch to unblock the UI
          fetchProfile(session.user.id);
        } else {
          setAuthUser(null);
          setStudent(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (creds) => {
    log('Sign Up Start...');
    const { data, error } = await supabase.auth.signUp({
      email: creds.email,
      password: creds.password,
      options: {
        data: { 
            full_name: creds.fullName,
            student_id: creds.studentId,
            phone: creds.phone,
            course: creds.course,
            sleep_time: creds.sleepTime,
            cleanliness: creds.cleanliness,
            study_preference: creds.studyPreference,
            noise_tolerance: creds.noiseTolerance
        }
      }
    });

    if (error) {
        log('Auth Sign Up Error:', error.message);
        throw error;
    }

    log('Auth Sign Up Success. Account created.');
    return data;
  };

  const signIn = async (creds) => {
    const { data, error } = await supabase.auth.signInWithPassword(creds);
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('isStudentAuthenticated');
    setStudent(null);
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider value={{ student, authUser, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
