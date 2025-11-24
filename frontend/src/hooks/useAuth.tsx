import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

/**
 * Custom hook para manejar autenticación y roles de usuario
 * @returns {Object} Estado de autenticación con usuario, sesión, rol y estado de carga
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<'administrador' | 'secretaria' | 'cliente' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configurar listener de cambios de autenticación PRIMERO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Obtener rol del usuario después de autenticarse
        if (session?.user) {
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        } else {
          setUserRole(null);
          setLoading(false);
        }
      }
    );

    // LUEGO verificar sesión existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Obtiene el rol del usuario desde la base de datos
   */
  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error al obtener rol:', error);
        setUserRole('cliente'); // Rol por defecto
      } else {
        setUserRole(data?.role || 'cliente');
      }
    } catch (error) {
      console.error('Error al obtener rol:', error);
      setUserRole('cliente');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verifica si el usuario tiene acceso administrativo (administrador o secretaria)
   */
  const hasAdminAccess = () => {
    return userRole === 'administrador' || userRole === 'secretaria';
  };

  /**
   * Cierra la sesión del usuario
   */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  };

  return {
    user,
    session,
    userRole,
    loading,
    hasAdminAccess: hasAdminAccess(),
    signOut
  };
};
