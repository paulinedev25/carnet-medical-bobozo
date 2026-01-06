import { ExportAsPdf } from "@siamf/react-export";

export function ExportPdfButton({ data, headers, title }) {
  return (
    <ExportAsPdf
      data={data}
      headers={headers}
      title={title}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      {(props) => (
        <button {...props}>
          📄 Exporter PDF
        </button>
      )}
    </ExportAsPdf>
  );
}
