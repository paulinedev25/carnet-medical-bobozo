import React from "react";
import { toast } from "react-toastify";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Erreur capturée par ErrorBoundary:", error, info);
    toast.error("⚠️ Une erreur est survenue dans cette section");
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-300 rounded">
          <h2 className="text-red-600 font-semibold">Erreur d’affichage</h2>
          <p className="text-sm text-red-500">
            {this.state.error?.message || "Une erreur inconnue est survenue."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
          >
            Réessayer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
