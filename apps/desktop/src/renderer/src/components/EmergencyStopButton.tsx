interface EmergencyStopButtonProps {
  engaged: boolean;
  disabled?: boolean;
  onEngage: () => void;
  onRelease: () => void;
}

export function EmergencyStopButton({ engaged, disabled, onEngage, onRelease }: EmergencyStopButtonProps) {
  if (engaged) {
    return (
      <button className="secondaryButton emergencyStopInline" onClick={onRelease} disabled={disabled}>
        Clear stop
      </button>
    );
  }

  return (
    <button className="dangerButton emergencyStopInline" onClick={onEngage} disabled={disabled}>
      Emergency stop
    </button>
  );
}
