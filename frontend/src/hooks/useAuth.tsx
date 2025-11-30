import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const [userRole, setUserRole] = useState<
    "administrador" | "secretaria" | "driver" | "cliente" | null
  >(localStorage.getItem("userRole") as any ?? null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          fetchUserRole(session.user.id);
        } else {
          setUserRole(null);
          localStorage.removeItem("userRole");
          setLoading(false);
        }
      }
    );

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
   * Obtiene el rol del usuario desde la tabla empleados
   */
  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("empleados")
        .select("tipo_empleado")
        .eq("user_id", userId)
        .single();

      if (error || !data?.tipo_empleado) {
        console.error("Error al obtener rol:", error);
        setUserRole("cliente");
        localStorage.setItem("userRole", "cliente");
      } else {
        let mappedRole: "administrador" | "secretaria" | "driver" | "cliente";

        switch (data.tipo_empleado) {
          case "a":
            mappedRole = "administrador";
            break;
          case "s":
            mappedRole = "secretaria";
            break;
          case "d":
            mappedRole = "driver";
            break;
          default:
            mappedRole = "cliente";
        }

        setUserRole(mappedRole);
        localStorage.setItem("userRole", mappedRole);
      }
    } catch (error) {
      console.error("Error al obtener rol:", error);
      setUserRole("cliente");
      localStorage.setItem("userRole", "cliente");
    } finally {
      setLoading(false);
    }
  };

  const hasAdminAccess = () => {
    return userRole === "administrador" || userRole === "secretaria";
  };

  const signOut = async () => {
    localStorage.removeItem("userRole");
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    session,
    userRole,
    loading,
    hasAdminAccess: hasAdminAccess(),
    signOut,
  };
};
