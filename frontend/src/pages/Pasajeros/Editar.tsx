import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const EditarPasajero = () => {
  const { document_passenger } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("passenger")
        .select("*")
        .eq("document_passenger", document_passenger)
        .single();

      if (error) {
        toast.error("Error al cargar pasajero");
        console.error(error);
      } else {
        setForm(data);
      }
    };

    fetchData();
  }, [document_passenger]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from("passenger")
      .update(form)
      .eq("document_passenger", document_passenger);

    if (error) {
      toast.error("Error al actualizar pasajero");
      console.error(error);
    } else {
      toast.success("Pasajero actualizado");
      navigate("/pasajeros");
    }
  };

  if (!form) return <p className="p-4">Cargando datos...</p>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Editar Pasajero</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {["name_1", "name_2", "last_name_1", "last_name_2", "phone", "birthdate"].map((field) => (
            <div key={field}>
              <Label>{field.replace(/_/g, " ")}</Label>
              <Input name={field} value={form[field]} onChange={handleChange} />
            </div>
          ))}
          <div>
            <Label>Género</Label>
            <select name="gender" value={form.gender} onChange={handleChange} className="w-full border rounded px-2 py-1">
              <option value="">Seleccionar</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
          <Button onClick={handleUpdate}>Actualizar</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditarPasajero;
