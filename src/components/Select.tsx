import React, { useEffect, useState } from "react";
import {
  Select as RadixSelect,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectLabel,
  SelectSeparator,
  SelectGroup,
} from "@/components/ui/select";
import { getCountriesAndIsps } from "@/api/measurementService";

type Props = {
  onFilterChange: (filters: { country?: string; isp?: string }) => void;
  initialCountry?: string;
  initialIsp?: string;
};

const Select: React.FC<Props> = ({ onFilterChange, initialCountry, initialIsp }) => {
  const [countries, setCountries] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(initialCountry);
  const [selectedIsp, setSelectedIsp] = useState<string | undefined>(initialIsp);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const res = await getCountriesAndIsps();
        setCountries(res.countries || {});
      } catch (err) {
        console.error("Error fetching countries and ISPs", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, []);

  useEffect(() => {
    // Actualizar URL con los filtros aplicados
    const params = new URLSearchParams(window.location.search);
    if (selectedCountry) params.set("country", selectedCountry);
    else params.delete("country");

    if (selectedIsp == "all") setSelectedIsp(""); // Limpiar el valor para hacer las busquedas
    if (selectedIsp) params.set("isp", selectedIsp);
    else params.delete("isp");

    const queryString = params.toString().replace(/\+/g, "%20");
    const newUrl = `${window.location.pathname}?${queryString}`;
    window.history.replaceState({}, "", queryString ? newUrl : window.location.pathname);

    // Emit filter change to parent
    onFilterChange({ country: selectedCountry, isp: selectedIsp });
  }, [selectedCountry, selectedIsp, onFilterChange]);

  const ispOptions = selectedCountry ? countries[selectedCountry] ?? [] : [];

  const clearFilters = () => {
    setSelectedCountry(undefined);
    setSelectedIsp(undefined);
  };

  return (
    <div className="flex justify-center items-center w-full gap-3 mb-4">
      <div>
        <RadixSelect value={selectedCountry} onValueChange={(v) => { setSelectedCountry(v || undefined); setSelectedIsp(undefined); }}>
          <SelectTrigger size="default">
            <SelectValue placeholder={isLoading ? "Cargando países..." : "Seleccionar país"} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>País</SelectLabel>
              <SelectSeparator />
              {Object.keys(countries).map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </RadixSelect>
      </div>

      <div>
        <RadixSelect value={selectedIsp} onValueChange={(v) => setSelectedIsp(v || undefined)}>
          <SelectTrigger size="default">
            <SelectValue placeholder={selectedCountry ? "Seleccionar ISP" : "Selecciona país primero"} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>ISP</SelectLabel>
              <SelectSeparator />
              <SelectItem key="all" value="all">Todos</SelectItem>
              {!isLoading && ispOptions.map((isp) => (
                <SelectItem key={isp} value={isp}>
                  {isp}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </RadixSelect>
      </div>

      <button type="button" onClick={clearFilters} className="btn btn-ghost">
        Limpiar
      </button>
    </div>
  );
};

export default Select;
