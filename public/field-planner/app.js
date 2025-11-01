// Cricket Field Planner Application - Complete Fixed Version
class CricketFieldPlanner {
    constructor() {
        this.players = [];
        this.currentFormation = 'custom';
        this.savedFields = [];
        this.isLeftHandedBatsman = false;
        this.currentZoom = 100;
        this.snapToGrid = false;
        this.showingPositions = false;
        this.draggedPlayer = null;
        this.isDragging = false;
        this.currentTheme = 'light';

        // Accurate field positions with proper coordinates
        this.fieldPositions = this.initializeFieldPositions();
        this.presetFormations = this.initializePresetFormations();

        this.init();
    }

    init() {
        this.setupElements();
        this.initializeTheme();
        this.createPlayers();
        this.setupEventListeners();
        this.loadSavedFields();
        this.setDefaultFormation();
        this.updateFieldBalance();
    }

    setupElements() {
        // Main elements
        this.groundElement = document.getElementById('cricketGround');
        this.playersContainer = document.getElementById('playersContainer');
        this.tooltip = document.getElementById('positionTooltip');
        this.positionMarkers = document.getElementById('positionMarkers');
        
        // Control elements
        this.presetSelect = document.getElementById('presetFormation');
        this.batsmanTypeSelect = document.getElementById('batsmanType');
        this.bowlerTypeSelect = document.getElementById('bowlerType');
        this.overStageSelect = document.getElementById('overStage');
        
        // Button elements
        this.themeToggleBtn = document.getElementById('themeToggleBtn');
        this.fourSlipsBtn = document.getElementById('fourSlipsBtn');
        this.ringFieldBtn = document.getElementById('ringFieldBtn');
        this.boundaryRidersBtn = document.getElementById('boundaryRidersBtn');
        this.saveFieldBtn = document.getElementById('saveFieldBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.resetFieldBtn = document.getElementById('resetFieldBtn');
        this.fieldMapBtn = document.getElementById('fieldMapBtn');
        
        // Analysis elements
        this.showCoverageBtn = document.getElementById('showCoverageBtn');
        this.showGapsBtn = document.getElementById('showGapsBtn');
        this.showRestrictionsBtn = document.getElementById('showRestrictionsBtn');
        this.showPositionsBtn = document.getElementById('showPositionsBtn');
        
        // Modal elements
        this.saveModal = document.getElementById('saveFieldModal');
        this.playerEditModal = document.getElementById('playerEditModal');
        this.fieldMapModal = document.getElementById('fieldMapModal');
        
        // Other elements
        this.playerList = document.getElementById('playerList');
        this.fieldBalanceDisplay = document.getElementById('fieldBalance');
        this.effectivenessRating = document.getElementById('effectivenessRating');
        this.effectivenessText = document.getElementById('effectivenessText');
        this.savedFieldsContainer = document.getElementById('savedFields');
    }

    initializeFieldPositions() {
        // Positions as percentages (0-100) relative to ground dimensions
        // FIELD ORIENTATION: Pitch CENTERED in ground (36% to 64%)
        // Bowler at y=36% (non-striker's end), runs DOWN towards batsman at y=60% (striker's end)
        // For RIGHT-HANDED batsman: OFF-SIDE = LEFT (x<50%), LEG-SIDE = RIGHT (x>50%)
        // Batsman position: x=50%, y=60% (at striker's end of pitch)
        // BEHIND batsman = y > 60%, IN FRONT of batsman = y < 60%

        return {
            // ==== CLOSE CATCHING POSITIONS (Behind batsman - y > 60%) ====

            // Wicket Keeper - directly behind stumps
            'Wicket Keeper': { x: 50, y: 64, zone: 'close', angle: 180, distance: 4 },

            // Slips - behind batsman on OFF-SIDE (left side, x < 50, y > 60)
            'First Slip': { x: 45, y: 66, zone: 'close', angle: 225, distance: 8 },
            'Second Slip': { x: 42, y: 68, zone: 'close', angle: 220, distance: 10 },
            'Third Slip': { x: 39, y: 70, zone: 'close', angle: 215, distance: 12 },
            'Fourth Slip': { x: 36, y: 72, zone: 'close', angle: 210, distance: 14 },

            // Gully - wider than slips, still behind
            'Gully': { x: 33, y: 64, zone: 'close', angle: 235, distance: 17 },

            // Leg Slip - behind batsman on LEG-SIDE (right side, x > 50, y > 60)
            'Leg Slip': { x: 55, y: 66, zone: 'close', angle: 135, distance: 8 },

            // Short Leg - close on leg side, slightly in front or square
            'Short Leg': { x: 58, y: 58, zone: 'close', angle: 90, distance: 9 },

            // Silly Point - very close on off side, in front
            'Silly Point': { x: 42, y: 56, zone: 'close', angle: 270, distance: 10 },

            // Silly Mid-Off - very close, straight on off side, in front
            'Silly Mid-Off': { x: 46, y: 52, zone: 'close', angle: 315, distance: 9 },

            // Silly Mid-On - very close, straight on leg side, in front
            'Silly Mid-On': { x: 54, y: 52, zone: 'close', angle: 45, distance: 9 },


            // ==== INNER RING (30-yard circle) - Around the batsman ====

            // OFF-SIDE positions (left side, x < 50)
            'Point': { x: 30, y: 60, zone: 'inner', angle: 270, distance: 20 },
            'Backward Point': { x: 34, y: 66, zone: 'inner', angle: 240, distance: 18 },
            'Cover Point': { x: 34, y: 54, zone: 'inner', angle: 290, distance: 18 },
            'Cover': { x: 38, y: 48, zone: 'inner', angle: 305, distance: 20 },
            'Extra Cover': { x: 42, y: 42, zone: 'inner', angle: 320, distance: 22 },
            'Mid-Off': { x: 46, y: 38, zone: 'inner', angle: 345, distance: 24 },

            // LEG-SIDE positions (right side, x > 50)
            'Mid-On': { x: 54, y: 38, zone: 'inner', angle: 15, distance: 24 },
            'Mid-Wicket': { x: 62, y: 42, zone: 'inner', angle: 40, distance: 22 },
            'Square Leg': { x: 70, y: 60, zone: 'inner', angle: 90, distance: 20 },
            'Backward Square Leg': { x: 66, y: 66, zone: 'inner', angle: 120, distance: 18 },

            // Fine positions behind batsman
            'Fine Leg': { x: 60, y: 72, zone: 'inner', angle: 150, distance: 18 },
            'Short Fine Leg': { x: 57, y: 67, zone: 'inner', angle: 140, distance: 12 },
            'Short Third Man': { x: 43, y: 67, zone: 'inner', angle: 220, distance: 12 },


            // ==== BOUNDARY POSITIONS (Deep fielders on the rope) ====

            // OFF-SIDE boundary (left side, x < 50)
            'Third Man': { x: 38, y: 78, zone: 'boundary', angle: 210, distance: 35 },
            'Deep Backward Point': { x: 24, y: 72, zone: 'boundary', angle: 235, distance: 38 },
            'Deep Point': { x: 16, y: 60, zone: 'boundary', angle: 270, distance: 34 },
            'Deep Cover': { x: 20, y: 46, zone: 'boundary', angle: 300, distance: 36 },
            'Deep Extra Cover': { x: 30, y: 34, zone: 'boundary', angle: 320, distance: 36 },
            'Long Off': { x: 44, y: 25, zone: 'boundary', angle: 345, distance: 38 },

            // LEG-SIDE boundary (right side, x > 50)
            'Long On': { x: 56, y: 25, zone: 'boundary', angle: 15, distance: 38 },
            'Deep Mid-Wicket': { x: 70, y: 34, zone: 'boundary', angle: 50, distance: 36 },
            'Cow Corner': { x: 76, y: 46, zone: 'boundary', angle: 70, distance: 36 },
            'Deep Square Leg': { x: 84, y: 60, zone: 'boundary', angle: 90, distance: 34 },
            'Deep Backward Square': { x: 76, y: 72, zone: 'boundary', angle: 115, distance: 38 },
            'Deep Fine Leg': { x: 62, y: 78, zone: 'boundary', angle: 145, distance: 35 }
        };
    }

    initializePresetFormations() {
        return {
            attacking: {
                name: 'Attacking (5 Slips)',
                description: 'Aggressive field with multiple slips for taking wickets',
                players: [
                    { role: 'bowler', position: 'Mid-Off', name: 'Bowler' },
                    { role: 'keeper', position: 'Wicket Keeper', name: 'Keeper' },
                    { role: 'fielder', position: 'First Slip', name: 'First Slip' },
                    { role: 'fielder', position: 'Second Slip', name: 'Second Slip' },
                    { role: 'fielder', position: 'Third Slip', name: 'Third Slip' },
                    { role: 'fielder', position: 'Fourth Slip', name: 'Fourth Slip' },
                    { role: 'fielder', position: 'Gully', name: 'Gully' },
                    { role: 'fielder', position: 'Point', name: 'Point' },
                    { role: 'fielder', position: 'Cover', name: 'Cover' },
                    { role: 'fielder', position: 'Mid-On', name: 'Mid-On' },
                    { role: 'fielder', position: 'Fine Leg', name: 'Fine Leg' }
                ]
            },
            defensive: {
                name: 'Defensive (7-2 Field)',
                description: 'Deep fielders to prevent boundaries',
                players: [
                    { role: 'bowler', position: 'Mid-Off', name: 'Bowler' },
                    { role: 'keeper', position: 'Wicket Keeper', name: 'Keeper' },
                    { role: 'fielder', position: 'Deep Point', name: 'Deep Point' },
                    { role: 'fielder', position: 'Deep Cover', name: 'Deep Cover' },
                    { role: 'fielder', position: 'Long Off', name: 'Long Off' },
                    { role: 'fielder', position: 'Long On', name: 'Long On' },
                    { role: 'fielder', position: 'Deep Mid-Wicket', name: 'Deep Mid-Wicket' },
                    { role: 'fielder', position: 'Deep Square Leg', name: 'Deep Square Leg' },
                    { role: 'fielder', position: 'Deep Fine Leg', name: 'Deep Fine Leg' },
                    { role: 'fielder', position: 'Third Man', name: 'Third Man' },
                    { role: 'fielder', position: 'Point', name: 'Point' }
                ]
            },
            'offside-heavy': {
                name: 'Off-side Heavy',
                description: '6-3 field with majority on off side',
                players: [
                    { role: 'bowler', position: 'Mid-Off', name: 'Bowler' },
                    { role: 'keeper', position: 'Wicket Keeper', name: 'Keeper' },
                    { role: 'fielder', position: 'First Slip', name: 'First Slip' },
                    { role: 'fielder', position: 'Gully', name: 'Gully' },
                    { role: 'fielder', position: 'Point', name: 'Point' },
                    { role: 'fielder', position: 'Cover', name: 'Cover' },
                    { role: 'fielder', position: 'Extra Cover', name: 'Extra Cover' },
                    { role: 'fielder', position: 'Deep Cover', name: 'Deep Cover' },
                    { role: 'fielder', position: 'Third Man', name: 'Third Man' },
                    { role: 'fielder', position: 'Mid-On', name: 'Mid-On' },
                    { role: 'fielder', position: 'Fine Leg', name: 'Fine Leg' }
                ]
            },
            'legside-heavy': {
                name: 'Leg-side Heavy',
                description: '3-6 field with majority on leg side',
                players: [
                    { role: 'bowler', position: 'Mid-Off', name: 'Bowler' },
                    { role: 'keeper', position: 'Wicket Keeper', name: 'Keeper' },
                    { role: 'fielder', position: 'Point', name: 'Point' },
                    { role: 'fielder', position: 'Cover', name: 'Cover' },
                    { role: 'fielder', position: 'Third Man', name: 'Third Man' },
                    { role: 'fielder', position: 'Mid-On', name: 'Mid-On' },
                    { role: 'fielder', position: 'Mid-Wicket', name: 'Mid-Wicket' },
                    { role: 'fielder', position: 'Square Leg', name: 'Square Leg' },
                    { role: 'fielder', position: 'Deep Square Leg', name: 'Deep Square Leg' },
                    { role: 'fielder', position: 'Fine Leg', name: 'Fine Leg' },
                    { role: 'fielder', position: 'Deep Fine Leg', name: 'Deep Fine Leg' }
                ]
            },
            'new-ball': {
                name: 'New Ball',
                description: 'Standard new ball attack field',
                players: [
                    { role: 'bowler', position: 'Mid-Off', name: 'Bowler' },
                    { role: 'keeper', position: 'Wicket Keeper', name: 'Keeper' },
                    { role: 'fielder', position: 'First Slip', name: 'First Slip' },
                    { role: 'fielder', position: 'Second Slip', name: 'Second Slip' },
                    { role: 'fielder', position: 'Third Slip', name: 'Third Slip' },
                    { role: 'fielder', position: 'Gully', name: 'Gully' },
                    { role: 'fielder', position: 'Point', name: 'Point' },
                    { role: 'fielder', position: 'Cover', name: 'Cover' },
                    { role: 'fielder', position: 'Mid-On', name: 'Mid-On' },
                    { role: 'fielder', position: 'Square Leg', name: 'Square Leg' },
                    { role: 'fielder', position: 'Fine Leg', name: 'Fine Leg' }
                ]
            },
            'spin-bowling': {
                name: 'Spin Bowling',
                description: 'Close catchers for spin bowling',
                players: [
                    { role: 'bowler', position: 'Mid-Off', name: 'Bowler' },
                    { role: 'keeper', position: 'Wicket Keeper', name: 'Keeper' },
                    { role: 'fielder', position: 'First Slip', name: 'First Slip' },
                    { role: 'fielder', position: 'Silly Point', name: 'Silly Point' },
                    { role: 'fielder', position: 'Short Leg', name: 'Short Leg' },
                    { role: 'fielder', position: 'Point', name: 'Point' },
                    { role: 'fielder', position: 'Cover', name: 'Cover' },
                    { role: 'fielder', position: 'Mid-On', name: 'Mid-On' },
                    { role: 'fielder', position: 'Mid-Wicket', name: 'Mid-Wicket' },
                    { role: 'fielder', position: 'Square Leg', name: 'Square Leg' },
                    { role: 'fielder', position: 'Backward Square Leg', name: 'Backward Square' }
                ]
            },
            'death-bowling': {
                name: 'Death Bowling',
                description: 'Boundary protection for death overs',
                players: [
                    { role: 'bowler', position: 'Mid-Off', name: 'Bowler' },
                    { role: 'keeper', position: 'Wicket Keeper', name: 'Keeper' },
                    { role: 'fielder', position: 'Deep Point', name: 'Deep Point' },
                    { role: 'fielder', position: 'Deep Cover', name: 'Deep Cover' },
                    { role: 'fielder', position: 'Long Off', name: 'Long Off' },
                    { role: 'fielder', position: 'Long On', name: 'Long On' },
                    { role: 'fielder', position: 'Cow Corner', name: 'Cow Corner' },
                    { role: 'fielder', position: 'Deep Mid-Wicket', name: 'Deep Mid-Wicket' },
                    { role: 'fielder', position: 'Deep Square Leg', name: 'Deep Square Leg' },
                    { role: 'fielder', position: 'Third Man', name: 'Third Man' },
                    { role: 'fielder', position: 'Short Fine Leg', name: 'Short Fine Leg' }
                ]
            },
            'powerplay-1-6': {
                name: 'Powerplay (1-6 Overs)',
                description: 'Only 2 fielders outside 30-yard circle',
                players: [
                    { role: 'bowler', position: 'Mid-Off', name: 'Bowler' },
                    { role: 'keeper', position: 'Wicket Keeper', name: 'Keeper' },
                    { role: 'fielder', position: 'First Slip', name: 'First Slip' },
                    { role: 'fielder', position: 'Second Slip', name: 'Second Slip' },
                    { role: 'fielder', position: 'Point', name: 'Point' },
                    { role: 'fielder', position: 'Cover', name: 'Cover' },
                    { role: 'fielder', position: 'Mid-On', name: 'Mid-On' },
                    { role: 'fielder', position: 'Mid-Wicket', name: 'Mid-Wicket' },
                    { role: 'fielder', position: 'Square Leg', name: 'Square Leg' },
                    { role: 'fielder', position: 'Third Man', name: 'Third Man' },
                    { role: 'fielder', position: 'Deep Fine Leg', name: 'Deep Fine Leg' }
                ]
            },
            'middle-overs-containment': {
                name: 'Middle Overs (7-40)',
                description: 'Maximum 5 fielders outside circle',
                players: [
                    { role: 'bowler', position: 'Mid-Off', name: 'Bowler' },
                    { role: 'keeper', position: 'Wicket Keeper', name: 'Keeper' },
                    { role: 'fielder', position: 'Point', name: 'Point' },
                    { role: 'fielder', position: 'Cover', name: 'Cover' },
                    { role: 'fielder', position: 'Mid-On', name: 'Mid-On' },
                    { role: 'fielder', position: 'Mid-Wicket', name: 'Mid-Wicket' },
                    { role: 'fielder', position: 'Deep Cover', name: 'Deep Cover' },
                    { role: 'fielder', position: 'Long Off', name: 'Long Off' },
                    { role: 'fielder', position: 'Deep Mid-Wicket', name: 'Deep Mid-Wicket' },
                    { role: 'fielder', position: 'Third Man', name: 'Third Man' },
                    { role: 'fielder', position: 'Deep Fine Leg', name: 'Deep Fine Leg' }
                ]
            },
            'test-match-day1': {
                name: 'Test Match Day 1',
                description: 'Classic Test match field',
                players: [
                    { role: 'bowler', position: 'Mid-Off', name: 'Bowler' },
                    { role: 'keeper', position: 'Wicket Keeper', name: 'Keeper' },
                    { role: 'fielder', position: 'First Slip', name: 'First Slip' },
                    { role: 'fielder', position: 'Second Slip', name: 'Second Slip' },
                    { role: 'fielder', position: 'Third Slip', name: 'Third Slip' },
                    { role: 'fielder', position: 'Gully', name: 'Gully' },
                    { role: 'fielder', position: 'Point', name: 'Point' },
                    { role: 'fielder', position: 'Cover', name: 'Cover' },
                    { role: 'fielder', position: 'Mid-On', name: 'Mid-On' },
                    { role: 'fielder', position: 'Square Leg', name: 'Square Leg' },
                    { role: 'fielder', position: 'Fine Leg', name: 'Fine Leg' }
                ]
            },
            'umbrella-field': {
                name: 'Umbrella Field',
                description: 'Ring field around the bat',
                players: [
                    { role: 'bowler', position: 'Mid-Off', name: 'Bowler' },
                    { role: 'keeper', position: 'Wicket Keeper', name: 'Keeper' },
                    { role: 'fielder', position: 'Point', name: 'Point' },
                    { role: 'fielder', position: 'Cover Point', name: 'Cover Point' },
                    { role: 'fielder', position: 'Cover', name: 'Cover' },
                    { role: 'fielder', position: 'Extra Cover', name: 'Extra Cover' },
                    { role: 'fielder', position: 'Mid-On', name: 'Mid-On' },
                    { role: 'fielder', position: 'Mid-Wicket', name: 'Mid-Wicket' },
                    { role: 'fielder', position: 'Square Leg', name: 'Square Leg' },
                    { role: 'fielder', position: 'Backward Square Leg', name: 'Backward Square' },
                    { role: 'fielder', position: 'Short Fine Leg', name: 'Short Fine Leg' }
                ]
            },
            'leg-side-theory': {
                name: 'Leg Side Theory',
                description: 'Bodyline style - leg side heavy',
                players: [
                    { role: 'bowler', position: 'Mid-Off', name: 'Bowler' },
                    { role: 'keeper', position: 'Wicket Keeper', name: 'Keeper' },
                    { role: 'fielder', position: 'Leg Slip', name: 'Leg Slip' },
                    { role: 'fielder', position: 'Short Leg', name: 'Short Leg' },
                    { role: 'fielder', position: 'Silly Mid-On', name: 'Silly Mid-On' },
                    { role: 'fielder', position: 'Mid-On', name: 'Mid-On' },
                    { role: 'fielder', position: 'Mid-Wicket', name: 'Mid-Wicket' },
                    { role: 'fielder', position: 'Square Leg', name: 'Square Leg' },
                    { role: 'fielder', position: 'Backward Square Leg', name: 'Backward Square' },
                    { role: 'fielder', position: 'Deep Square Leg', name: 'Deep Square Leg' },
                    { role: 'fielder', position: 'Fine Leg', name: 'Fine Leg' }
                ]
            }
        };
    }

    createPlayers() {
        // Create 11 players
        const playerRoles = [
            { role: 'bowler', name: 'Bowler', number: 'B' },
            { role: 'keeper', name: 'Keeper', number: 'WK' }
        ];
        
        // Add 9 fielders
        for (let i = 1; i <= 9; i++) {
            playerRoles.push({ role: 'fielder', name: `Fielder ${i}`, number: i });
        }
        
        playerRoles.forEach((playerData, index) => {
            const player = this.createPlayer(playerData.role, playerData.name, playerData.number);
            this.players.push(player);
            this.playersContainer.appendChild(player.element);
        });
        
        this.updatePlayerList();
    }

    createPlayer(role, name, number) {
        const element = document.createElement('div');
        element.className = `player ${role}`;
        element.textContent = number;
        element.style.left = '50%';
        element.style.top = '50%';

        const player = {
            id: `player-${number}`,
            element,
            role,
            name,
            number,
            position: { x: 50, y: 50 }, // Store as percentage
            positionName: 'Center',
            isDragging: false
        };

        // Add event listeners
        this.setupPlayerEventListeners(player);

        return player;
    }

    setupPlayerEventListeners(player) {
        const element = player.element;
        
        // Mouse events
        element.addEventListener('mousedown', (e) => this.startDrag(e, player));
        element.addEventListener('mouseenter', (e) => this.showTooltip(e, player));
        element.addEventListener('mouseleave', () => this.hideTooltip());
        element.addEventListener('dblclick', () => this.editPlayer(player));
        
        // Touch events for mobile
        element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDrag(e, player);
        }, { passive: false });
    }

    setupEventListeners() {
        // Global mouse/touch events for dragging
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.endDrag());
        document.addEventListener('touchmove', (e) => this.drag(e), { passive: false });
        document.addEventListener('touchend', () => this.endDrag());

        // Control events
        this.presetSelect.addEventListener('change', (e) => this.applyPreset(e.target.value));
        this.batsmanTypeSelect.addEventListener('change', (e) => this.handleBatsmanChange(e.target.value));
        this.bowlerTypeSelect.addEventListener('change', () => this.updateFormationAnalysis());
        this.overStageSelect.addEventListener('change', () => this.updateFormationAnalysis());

        // Button events
        this.themeToggleBtn?.addEventListener('click', () => this.toggleTheme());
        this.fourSlipsBtn.addEventListener('click', () => this.applyQuickFormation('fourSlips'));
        this.ringFieldBtn.addEventListener('click', () => this.applyQuickFormation('ringField'));
        this.boundaryRidersBtn.addEventListener('click', () => this.applyQuickFormation('boundaryRiders'));
        this.saveFieldBtn.addEventListener('click', () => this.showSaveModal());
        this.exportBtn.addEventListener('click', () => this.exportField());
        this.resetFieldBtn.addEventListener('click', () => this.resetField());
        this.fieldMapBtn?.addEventListener('click', () => this.showFieldMap());
        
        // Analysis buttons
        this.showCoverageBtn.addEventListener('click', () => this.toggleAnalysis('coverage'));
        this.showGapsBtn.addEventListener('click', () => this.toggleAnalysis('gaps'));
        this.showRestrictionsBtn.addEventListener('click', () => this.toggleAnalysis('restrictions'));
        this.showPositionsBtn?.addEventListener('click', () => this.togglePositionMarkers());
        
        // Modal events
        document.getElementById('cancelSaveBtn').addEventListener('click', () => this.hideSaveModal());
        document.getElementById('confirmSaveBtn').addEventListener('click', () => this.saveField());
        document.getElementById('cancelEditBtn').addEventListener('click', () => this.hidePlayerEditModal());
        document.getElementById('confirmEditBtn').addEventListener('click', () => this.savePlayerEdit());
        document.getElementById('saveCurrentBtn').addEventListener('click', () => this.showSaveModal());
        document.getElementById('closeFieldMapBtn')?.addEventListener('click', () => this.hideFieldMap());
        
        // Ground controls
        document.getElementById('zoomInBtn').addEventListener('click', () => this.zoom(110));
        document.getElementById('zoomOutBtn').addEventListener('click', () => this.zoom(90));
        document.getElementById('snapToGridBtn').addEventListener('click', () => this.toggleSnapToGrid());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    startDrag(e, player) {
        this.draggedPlayer = player;
        this.isDragging = true;
        player.isDragging = true;
        player.element.classList.add('dragging');
        
        const rect = this.groundElement.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        player.dragOffset = {
            x: clientX - rect.left - player.position.x,
            y: clientY - rect.top - player.position.y
        };
        
        e.preventDefault();
    }

    drag(e) {
        if (!this.isDragging || !this.draggedPlayer) return;

        const rect = this.groundElement.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        let x = clientX - rect.left - this.draggedPlayer.dragOffset.x;
        let y = clientY - rect.top - this.draggedPlayer.dragOffset.y;

        // Apply zoom scaling
        const scale = this.currentZoom / 100;
        x = x / scale;
        y = y / scale;

        // Get ground dimensions
        const groundSize = this.getGroundDimensions();

        // Convert to percentage
        let xPercent = (x / groundSize.width) * 100;
        let yPercent = (y / groundSize.height) * 100;

        // Constrain within ground bounds
        xPercent = Math.max(2, Math.min(98, xPercent));
        yPercent = Math.max(2, Math.min(98, yPercent));

        // Apply snap to grid if enabled
        if (this.snapToGrid) {
            const gridSize = 5; // 5% grid
            xPercent = Math.round(xPercent / gridSize) * gridSize;
            yPercent = Math.round(yPercent / gridSize) * gridSize;
        }

        this.updatePlayerPosition(this.draggedPlayer, xPercent, yPercent);

        e.preventDefault();
    }

    endDrag() {
        if (!this.isDragging || !this.draggedPlayer) return;
        
        this.draggedPlayer.isDragging = false;
        this.draggedPlayer.element.classList.remove('dragging');
        this.draggedPlayer.element.classList.add('placed');
        
        setTimeout(() => {
            this.draggedPlayer.element.classList.remove('placed');
        }, 300);
        
        this.updateFormationAnalysis();
        this.updateFieldBalance();
        
        this.draggedPlayer = null;
        this.isDragging = false;
    }

    updatePlayerPosition(player, x, y) {
        player.position = { x, y };
        player.element.style.left = `${x}%`;
        player.element.style.top = `${y}%`;

        // Update position name based on location
        player.positionName = this.detectPosition(x, y);
        this.updatePlayerList();
    }

    detectPosition(x, y) {
        // Find closest named position
        let closestPosition = 'Custom Position';
        let minDistance = 8; // Threshold for snapping to position (8% of ground)

        for (const [posName, posData] of Object.entries(this.fieldPositions)) {
            const posDist = Math.sqrt(Math.pow(x - posData.x, 2) + Math.pow(y - posData.y, 2));
            if (posDist < minDistance) {
                minDistance = posDist;
                closestPosition = posName;
            }
        }

        // If no close match, describe general area
        if (closestPosition === 'Custom Position') {
            const batsmanX = 50;
            const batsmanY = 60;
            const relX = x - batsmanX;
            const relY = y - batsmanY;
            const dist = Math.sqrt(relX * relX + relY * relY);

            let zone = dist < 15 ? 'Close' : dist < 30 ? 'Inner Ring' : 'Boundary';
            let side = relX < -2 ? 'Off-Side' : relX > 2 ? 'Leg-Side' : 'Straight';
            let depth = relY < -5 ? 'Behind' : relY > 15 ? 'Deep' : '';

            closestPosition = `${zone} ${depth} ${side}`.trim();
        }

        return closestPosition;
    }

    getGroundDimensions() {
        const styles = window.getComputedStyle(this.groundElement);
        return {
            width: parseInt(styles.width),
            height: parseInt(styles.height)
        };
    }

    showTooltip(e, player) {
        if (player.isDragging) return;
        
        const tooltipContent = this.tooltip.querySelector('.tooltip-content');
        const positionName = tooltipContent.querySelector('.position-name');
        const positionDescription = tooltipContent.querySelector('.position-description');
        
        positionName.textContent = `${player.name} - ${player.positionName}`;
        positionDescription.textContent = this.getPositionDescription(player.positionName);
        
        const rect = this.groundElement.getBoundingClientRect();
        const tooltipX = e.clientX - rect.left + 15;
        const tooltipY = e.clientY - rect.top - 10;
        
        this.tooltip.style.left = `${tooltipX}px`;
        this.tooltip.style.top = `${tooltipY}px`;
        this.tooltip.classList.add('visible');
    }

    hideTooltip() {
        this.tooltip.classList.remove('visible');
    }

    getPositionDescription(positionName) {
        const descriptions = {
            'Wicket Keeper': 'Behind the stumps, catches and prevents byes',
            'First Slip': 'Catches edges from pace bowlers',
            'Second Slip': 'Second slip catching position',
            'Third Slip': 'Third slip in the cordon',
            'Fourth Slip': 'Wide slip position',
            'Gully': 'Between point and slips',
            'Silly Point': 'Very close on off side',
            'Short Leg': 'Close catching on leg side',
            'Point': 'Square on the off side',
            'Cover': 'Between point and mid-off',
            'Mid-Off': 'Straight on off side',
            'Mid-On': 'Straight on leg side',
            'Mid-Wicket': 'Between mid-on and square leg',
            'Square Leg': 'Square on leg side',
            'Fine Leg': 'Behind square on leg side',
            'Third Man': 'Behind keeper on off side boundary',
            'Long Off': 'Straight boundary off side',
            'Long On': 'Straight boundary leg side',
            'Deep Cover': 'Cover boundary',
            'Deep Mid-Wicket': 'Mid-wicket boundary',
            'Deep Square Leg': 'Square leg boundary'
        };
        
        return descriptions[positionName] || 'Custom field position';
    }

    applyPreset(presetName) {
        if (presetName === 'custom') return;
        
        const preset = this.presetFormations[presetName];
        if (!preset) return;
        
        this.currentFormation = presetName;
        
        preset.players.forEach((playerData, index) => {
            if (index < this.players.length) {
                const player = this.players[index];
                const position = this.fieldPositions[playerData.position] || { x: 50, y: 50 };

                // Apply position with left/right handed adjustment
                let adjustedX = position.x;
                if (this.isLeftHandedBatsman && playerData.position !== 'Wicket Keeper') {
                    adjustedX = 100 - position.x; // Mirror for left-handed
                }
                
                this.updatePlayerPosition(player, adjustedX, position.y);
                player.name = playerData.name;
                player.role = playerData.role;
                player.element.className = `player ${playerData.role}`;
            }
        });
        
        this.updatePlayerList();
        this.updateFormationAnalysis();
        this.updateFieldBalance();
    }

    applyQuickFormation(type) {
        switch (type) {
            case 'fourSlips':
                this.setFourSlips();
                break;
            case 'ringField':
                this.setRingField();
                break;
            case 'boundaryRiders':
                this.setBoundaryRiders();
                break;
        }
        
        this.presetSelect.value = 'custom';
        this.currentFormation = 'custom';
        this.updatePlayerList();
        this.updateFormationAnalysis();
        this.updateFieldBalance();
    }

    setFourSlips() {
        const slipPositions = ['First Slip', 'Second Slip', 'Third Slip', 'Fourth Slip'];
        let slipIndex = 0;
        
        this.players.forEach(player => {
            if (player.role === 'fielder' && slipIndex < 4) {
                const posName = slipPositions[slipIndex];
                const pos = this.fieldPositions[posName];
                this.updatePlayerPosition(player, pos.x, pos.y);
                player.name = posName;
                slipIndex++;
            }
        });
    }

    setRingField() {
        const ringPositions = ['Point', 'Cover', 'Extra Cover', 'Mid-Off', 'Mid-On', 
                              'Mid-Wicket', 'Square Leg', 'Backward Square Leg', 'Short Fine Leg'];
        
        let ringIndex = 0;
        this.players.forEach(player => {
            if (player.role === 'fielder' && ringIndex < ringPositions.length) {
                const posName = ringPositions[ringIndex];
                const pos = this.fieldPositions[posName];
                if (pos) {
                    this.updatePlayerPosition(player, pos.x, pos.y);
                    player.name = posName;
                    ringIndex++;
                }
            }
        });
    }

    setBoundaryRiders() {
        const boundaryPositions = ['Deep Point', 'Deep Cover', 'Long Off', 'Long On',
                                  'Deep Mid-Wicket', 'Deep Square Leg', 'Deep Fine Leg', 'Third Man'];
        
        let boundaryIndex = 0;
        this.players.forEach(player => {
            if (player.role === 'fielder' && boundaryIndex < boundaryPositions.length) {
                const posName = boundaryPositions[boundaryIndex];
                const pos = this.fieldPositions[posName];
                if (pos) {
                    this.updatePlayerPosition(player, pos.x, pos.y);
                    player.name = posName;
                    boundaryIndex++;
                }
            }
        });
    }

    togglePositionMarkers() {
        if (!this.positionMarkers) return;
        
        this.showingPositions = !this.showingPositions;
        this.showPositionsBtn.textContent = this.showingPositions ? 'Hide Positions' : 'Show Positions';
        
        if (this.showingPositions) {
            this.showPositionMarkers();
        } else {
            this.hidePositionMarkers();
        }
    }

    showPositionMarkers() {
        if (!this.positionMarkers) return;

        this.positionMarkers.innerHTML = '';
        this.positionMarkers.classList.add('visible');

        for (const [posName, posData] of Object.entries(this.fieldPositions)) {
            const marker = document.createElement('div');
            marker.className = 'position-marker';
            marker.style.left = `${posData.x}%`;
            marker.style.top = `${posData.y}%`;
            marker.style.transform = 'translate(-50%, -50%)';

            // Color code by zone
            if (posData.zone === 'close') {
                marker.style.borderColor = 'rgba(255, 100, 100, 0.7)';
                marker.style.backgroundColor = 'rgba(255, 100, 100, 0.1)';
            } else if (posData.zone === 'inner') {
                marker.style.borderColor = 'rgba(255, 255, 100, 0.7)';
                marker.style.backgroundColor = 'rgba(255, 255, 100, 0.1)';
            } else {
                marker.style.borderColor = 'rgba(100, 255, 100, 0.7)';
                marker.style.backgroundColor = 'rgba(100, 255, 100, 0.1)';
            }

            const label = document.createElement('div');
            label.className = 'position-marker-label';
            label.textContent = posName;
            marker.appendChild(label);

            this.positionMarkers.appendChild(marker);
        }
    }

    hidePositionMarkers() {
        if (!this.positionMarkers) return;
        this.positionMarkers.classList.remove('visible');
    }

    showFieldMap() {
        if (!this.fieldMapModal) return;
        this.fieldMapModal.classList.add('active');
        this.renderFieldMapDiagram();
    }

    hideFieldMap() {
        if (!this.fieldMapModal) return;
        this.fieldMapModal.classList.remove('active');
    }

    renderFieldMapDiagram() {
        const overlay = document.getElementById('fieldPositionsOverlay');
        if (!overlay) return;

        overlay.innerHTML = '';

        // Add position labels to the field map (matching corrected coordinates)
        // Red = close catching, Yellow = inner ring, Green = boundary
        const positions = [
            // Close catching positions (Red)
            { name: 'WK', x: 50, y: 64, color: '#ff5252' },
            { name: '1st Slip', x: 45, y: 66, color: '#ff5252' },
            { name: '2nd Slip', x: 42, y: 68, color: '#ff5252' },
            { name: '3rd Slip', x: 39, y: 70, color: '#ff5252' },
            { name: 'Gully', x: 33, y: 64, color: '#ff5252' },

            // Inner ring positions (Yellow)
            { name: 'Point', x: 30, y: 60, color: '#ffeb3b' },
            { name: 'Cover', x: 38, y: 48, color: '#ffeb3b' },
            { name: 'Mid-off', x: 46, y: 38, color: '#ffeb3b' },
            { name: 'Mid-on', x: 54, y: 38, color: '#ffeb3b' },
            { name: 'Mid-wicket', x: 62, y: 42, color: '#ffeb3b' },
            { name: 'Square Leg', x: 70, y: 60, color: '#ffeb3b' },
            { name: 'Fine Leg', x: 60, y: 72, color: '#ffeb3b' },

            // Boundary positions (Green)
            { name: 'Third Man', x: 38, y: 78, color: '#4caf50' },
            { name: 'Long Off', x: 44, y: 25, color: '#4caf50' },
            { name: 'Long On', x: 56, y: 25, color: '#4caf50' },
            { name: 'Deep Cover', x: 20, y: 46, color: '#4caf50' },
            { name: 'Deep Mid-wicket', x: 70, y: 34, color: '#4caf50' },
            { name: 'Deep Square', x: 84, y: 60, color: '#4caf50' },
            { name: 'Deep Fine', x: 62, y: 78, color: '#4caf50' }
        ];

        positions.forEach(pos => {
            const label = document.createElement('div');
            label.style.position = 'absolute';
            label.style.left = `${pos.x}%`;
            label.style.top = `${pos.y}%`;
            label.style.transform = 'translate(-50%, -50%)';
            label.style.fontSize = '10px';
            label.style.fontWeight = 'bold';
            label.style.color = pos.color;
            label.style.textShadow = '0 0 2px rgba(0,0,0,0.8)';
            label.textContent = pos.name;
            overlay.appendChild(label);
        });
    }

    handleBatsmanChange(handedness) {
        this.isLeftHandedBatsman = handedness === 'left-handed';
        
        // Mirror field for left-handed batsman
        if (this.currentFormation !== 'custom') {
            this.applyPreset(this.currentFormation);
        }
        
        this.updateFieldBalance();
    }

    updateFieldBalance() {
        let offSide = 0;
        let legSide = 0;

        this.players.forEach(player => {
            if (player.role === 'fielder') {
                const relativeX = player.position.x - 50;
                // For RIGHT-HANDED: OFF-SIDE = left (x<50), LEG-SIDE = right (x>50)
                // For LEFT-HANDED: reversed
                if (this.isLeftHandedBatsman) {
                    if (relativeX > 0) offSide++;
                    else legSide++;
                } else {
                    if (relativeX < 0) offSide++;
                    else legSide++;
                }
            }
        });

        this.fieldBalanceDisplay.textContent = `${offSide}-${legSide} field`;
    }

    updatePlayerList() {
        this.playerList.innerHTML = '';
        
        this.players.forEach(player => {
            const item = document.createElement('div');
            item.className = 'player-item';
            item.innerHTML = `
                <div>
                    <div>${player.name}</div>
                    <div class="player-role">${player.role}</div>
                </div>
                <div style="font-size: 11px; color: var(--color-text-secondary);">${player.positionName}</div>
            `;
            
            item.addEventListener('click', () => this.editPlayer(player));
            this.playerList.appendChild(item);
        });
    }

    editPlayer(player) {
        this.currentEditPlayer = player;
        document.getElementById('playerName').value = player.name;
        document.getElementById('playerRole').value = player.role;
        this.showPlayerEditModal();
    }

    showPlayerEditModal() {
        this.playerEditModal.classList.add('active');
    }

    hidePlayerEditModal() {
        this.playerEditModal.classList.remove('active');
        this.currentEditPlayer = null;
    }

    savePlayerEdit() {
        if (!this.currentEditPlayer) return;
        
        const newName = document.getElementById('playerName').value;
        const newRole = document.getElementById('playerRole').value;
        
        this.currentEditPlayer.name = newName;
        this.currentEditPlayer.role = newRole;
        this.currentEditPlayer.element.className = `player ${newRole}`;
        
        this.updatePlayerList();
        this.hidePlayerEditModal();
    }

    showSaveModal() {
        this.saveModal.classList.add('active');
        document.getElementById('fieldName').value = '';
        document.getElementById('fieldDescription').value = '';
    }

    hideSaveModal() {
        this.saveModal.classList.remove('active');
    }

    saveField() {
        const name = document.getElementById('fieldName').value.trim();
        const description = document.getElementById('fieldDescription').value.trim();
        
        if (!name) {
            alert('Please enter a name for the field setting');
            return;
        }
        
        const fieldData = {
            name,
            description,
            formation: this.currentFormation,
            players: this.players.map(player => ({
                name: player.name,
                role: player.role,
                position: player.position,
                positionName: player.positionName
            })),
            isLeftHandedBatsman: this.isLeftHandedBatsman,
            bowlerType: this.bowlerTypeSelect.value,
            overStage: this.overStageSelect.value,
            timestamp: new Date().toISOString()
        };
        
        this.savedFields.push(fieldData);
        this.saveSavedFields();
        this.updateSavedFieldsList();
        this.hideSaveModal();
        
        this.showNotification(`Field "${name}" saved successfully!`, 'success');
    }

    loadSavedFields() {
        const saved = localStorage.getItem('cricketFields');
        if (saved) {
            this.savedFields = JSON.parse(saved);
        } else {
            this.savedFields = [];
        }
        this.updateSavedFieldsList();
    }

    saveSavedFields() {
        localStorage.setItem('cricketFields', JSON.stringify(this.savedFields));
    }

    updateSavedFieldsList() {
        this.savedFieldsContainer.innerHTML = '';
        
        this.savedFields.forEach((field, index) => {
            const item = document.createElement('div');
            item.className = 'saved-field-item';
            item.innerHTML = `
                <div style="font-weight: 500;">${field.name}</div>
                <div style="font-size: 11px; color: var(--color-text-secondary); margin-top: 2px;">${field.formation}</div>
            `;
            
            item.addEventListener('click', () => this.loadSavedField(field));
            this.savedFieldsContainer.appendChild(item);
        });
    }

    loadSavedField(fieldData) {
        this.currentFormation = fieldData.formation;
        this.isLeftHandedBatsman = fieldData.isLeftHandedBatsman;
        
        this.batsmanTypeSelect.value = fieldData.isLeftHandedBatsman ? 'left-handed' : 'right-handed';
        this.bowlerTypeSelect.value = fieldData.bowlerType;
        this.overStageSelect.value = fieldData.overStage;
        this.presetSelect.value = fieldData.formation;
        
        fieldData.players.forEach((playerData, index) => {
            if (index < this.players.length) {
                const player = this.players[index];
                player.name = playerData.name;
                player.role = playerData.role;
                player.element.className = `player ${playerData.role}`;
                this.updatePlayerPosition(player, playerData.position.x, playerData.position.y);
            }
        });
        
        this.updatePlayerList();
        this.updateFormationAnalysis();
        this.updateFieldBalance();
        
        this.showNotification(`Loaded field "${fieldData.name}"`, 'success');
    }

    exportField() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 600;
        canvas.height = 600;
        
        // Draw ground
        const gradient = ctx.createRadialGradient(300, 300, 0, 300, 300, 250);
        gradient.addColorStop(0, '#2d5016');
        gradient.addColorStop(1, '#1a3d0b');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(300, 300, 250, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw boundary
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(300, 300, 240, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Draw 30-yard circle
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(300, 300, 120, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw pitch
        ctx.fillStyle = '#8b6914';
        ctx.fillRect(280, 220, 40, 160);
        
        // Draw creases
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(275, 300);
        ctx.lineTo(325, 300);
        ctx.moveTo(275, 240);
        ctx.lineTo(325, 240);
        ctx.moveTo(275, 360);
        ctx.lineTo(325, 360);
        ctx.stroke();
        
        // Draw players
        this.players.forEach(player => {
            const x = (player.position.x / 100) * 600;
            const y = (player.position.y / 100) * 600;

            ctx.beginPath();
            ctx.arc(x, y, 12, 0, 2 * Math.PI);

            if (player.role === 'bowler') ctx.fillStyle = '#c0152f';
            else if (player.role === 'keeper') ctx.fillStyle = '#21808d';
            else ctx.fillStyle = '#4caf50';

            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(player.number.toString(), x, y + 4);

            ctx.font = '9px Arial';
            ctx.fillText(player.positionName, x, y + 25);
        });
        
        // Add title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.currentFormation.toUpperCase() + ' FIELD', 300, 30);
        
        // Download
        const link = document.createElement('a');
        link.download = `cricket-field-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        this.showNotification('Field exported as image', 'success');
    }

    resetField() {
        if (confirm('Reset field to default positions?')) {
            this.setDefaultFormation();
            this.presetSelect.value = 'custom';
            this.currentFormation = 'custom';
            this.updatePlayerList();
            this.updateFormationAnalysis();
            this.updateFieldBalance();
            this.showNotification('Field reset to default', 'info');
        }
    }

    setDefaultFormation() {
        const defaultPositions = [
            'Mid-Off', 'Wicket Keeper', 'First Slip', 'Second Slip',
            'Point', 'Cover', 'Mid-On', 'Mid-Wicket', 'Square Leg',
            'Backward Square Leg', 'Fine Leg'
        ];

        this.players.forEach((player, index) => {
            const posName = defaultPositions[index];
            const pos = this.fieldPositions[posName] || { x: 50, y: 50 };
            this.updatePlayerPosition(player, pos.x, pos.y);
            player.name = posName;
        });
    }

    updateFormationAnalysis() {
        const effectiveness = this.calculateFieldEffectiveness();
        
        this.effectivenessRating.style.width = `${effectiveness}%`;
        
        if (effectiveness >= 80) {
            this.effectivenessText.textContent = 'Excellent';
            this.effectivenessRating.style.background = 'var(--color-success)';
        } else if (effectiveness >= 60) {
            this.effectivenessText.textContent = 'Good';
            this.effectivenessRating.style.background = 'var(--color-success)';
        } else if (effectiveness >= 40) {
            this.effectivenessText.textContent = 'Average';
            this.effectivenessRating.style.background = 'var(--color-warning)';
        } else {
            this.effectivenessText.textContent = 'Poor';
            this.effectivenessRating.style.background = 'var(--color-error)';
        }
    }

    calculateFieldEffectiveness() {
        let score = 50;
        
        const balance = this.getFieldBalance();
        if (Math.abs(balance.offSide - balance.legSide) <= 2) score += 15;
        else if (Math.abs(balance.offSide - balance.legSide) > 4) score -= 10;
        
        const bowlerType = this.bowlerTypeSelect.value;
        const overStage = this.overStageSelect.value;
        
        if (bowlerType === 'fast' && this.hasSlips()) score += 10;
        if (bowlerType === 'spin' && this.hasCloseFielders()) score += 10;
        if (overStage === 'death-overs' && this.hasBoundaryProtection()) score += 15;
        
        if (this.hasFieldGaps()) score -= 15;
        
        return Math.max(0, Math.min(100, score));
    }

    getFieldBalance() {
        let offSide = 0;
        let legSide = 0;

        this.players.forEach(player => {
            if (player.role === 'fielder') {
                const relativeX = player.position.x - 50;
                // For RIGHT-HANDED: OFF-SIDE = left (x<50), LEG-SIDE = right (x>50)
                // For LEFT-HANDED: reversed
                if (this.isLeftHandedBatsman) {
                    if (relativeX > 0) offSide++;
                    else legSide++;
                } else {
                    if (relativeX < 0) offSide++;
                    else legSide++;
                }
            }
        });

        return { offSide, legSide };
    }

    hasSlips() {
        return this.players.some(player => 
            player.positionName.includes('Slip') && player.role === 'fielder'
        );
    }

    hasCloseFielders() {
        const closePositions = ['Silly Point', 'Short Leg', 'Silly Mid-Off', 'Silly Mid-On'];
        return this.players.some(player => 
            closePositions.includes(player.positionName)
        );
    }

    hasBoundaryProtection() {
        const boundaryCount = this.players.filter(player => {
            if (player.role !== 'fielder') return false;
            // Check distance from batsman position (50%, 50%)
            const distance = Math.sqrt(
                Math.pow(player.position.x - 50, 2) +
                Math.pow(player.position.y - 50, 2)
            );
            return distance > 32; // 32% from batsman = boundary
        }).length;
        return boundaryCount >= 6;
    }

    hasFieldGaps() {
        const sectors = Array(8).fill(0);

        // Batsman is at y=50%, so we check gaps relative to batsman position
        this.players.forEach(player => {
            if (player.role === 'fielder') {
                const angle = Math.atan2(
                    player.position.y - 50, // Relative to batsman position
                    player.position.x - 50
                ) * (180 / Math.PI);
                const normalizedAngle = angle < 0 ? angle + 360 : angle;
                const sector = Math.floor(normalizedAngle / 45);
                sectors[sector]++;
            }
        });

        return sectors.filter(count => count === 0).length > 2;
    }

    toggleAnalysis(type) {
        const overlay = document.getElementById(`${type}Overlay`);
        overlay.classList.toggle('active');
        
        ['coverage', 'gaps', 'restrictions'].forEach(overlayType => {
            if (overlayType !== type) {
                document.getElementById(`${overlayType}Overlay`).classList.remove('active');
            }
        });
        
        if (overlay.classList.contains('active')) {
            this.showAnalysis(type);
        }
    }

    showAnalysis(type) {
        const overlay = document.getElementById(`${type}Overlay`);
        overlay.innerHTML = '';
        
        switch (type) {
            case 'coverage':
                this.showCoverageAnalysis(overlay);
                break;
            case 'gaps':
                this.showGapAnalysis(overlay);
                break;
            case 'restrictions':
                this.showRestrictionsAnalysis(overlay);
                break;
        }
    }

    showCoverageAnalysis(overlay) {
        this.players.forEach(player => {
            if (player.role === 'fielder') {
                const circle = document.createElement('div');
                circle.style.position = 'absolute';
                circle.style.left = `${player.position.x}%`;
                circle.style.top = `${player.position.y}%`;
                circle.style.width = '12%';
                circle.style.height = '12%';
                circle.style.transform = 'translate(-50%, -50%)';
                circle.style.border = '2px solid rgba(0, 255, 0, 0.5)';
                circle.style.borderRadius = '50%';
                circle.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
                overlay.appendChild(circle);
            }
        });
    }

    showGapAnalysis(overlay) {
        const gaps = this.identifyGaps();

        gaps.forEach(gap => {
            const gapIndicator = document.createElement('div');
            gapIndicator.style.position = 'absolute';
            gapIndicator.style.left = `${gap.x}%`;
            gapIndicator.style.top = `${gap.y}%`;
            gapIndicator.style.width = '6%';
            gapIndicator.style.height = '6%';
            gapIndicator.style.transform = 'translate(-50%, -50%)';
            gapIndicator.style.border = '2px solid rgba(255, 0, 0, 0.8)';
            gapIndicator.style.borderRadius = '50%';
            gapIndicator.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
            overlay.appendChild(gapIndicator);
        });
    }

    showRestrictionsAnalysis(overlay) {
        // 30-yard circle centered around batsman position
        const restrictionCircle = document.createElement('div');
        restrictionCircle.style.position = 'absolute';
        restrictionCircle.style.left = '50%';
        restrictionCircle.style.top = '50%'; // Batsman position
        restrictionCircle.style.width = '44%';
        restrictionCircle.style.height = '44%';
        restrictionCircle.style.transform = 'translate(-50%, -50%)';
        restrictionCircle.style.border = '3px dashed rgba(255, 255, 0, 0.8)';
        restrictionCircle.style.borderRadius = '50%';
        restrictionCircle.style.backgroundColor = 'rgba(255, 255, 0, 0.05)';
        overlay.appendChild(restrictionCircle);

        const restrictionText = document.createElement('div');
        restrictionText.style.position = 'absolute';
        restrictionText.style.left = '50%';
        restrictionText.style.top = '72%';
        restrictionText.style.transform = 'translateX(-50%)';
        restrictionText.style.color = 'rgba(255, 255, 0, 0.9)';
        restrictionText.style.fontWeight = 'bold';
        restrictionText.style.fontSize = '12px';
        restrictionText.style.textShadow = '0 0 2px rgba(0,0,0,0.8)';
        restrictionText.textContent = '30-yard circle';
        overlay.appendChild(restrictionText);
    }

    identifyGaps() {
        const gaps = [];
        const numAngles = 16;
        const batsmanX = 50;
        const batsmanY = 50;

        for (let i = 0; i < numAngles; i++) {
            const angle = (i * 360 / numAngles) * Math.PI / 180;
            const radius = 22; // Check at 30-yard circle from batsman
            const x = batsmanX + radius * Math.cos(angle);
            const y = batsmanY + radius * Math.sin(angle);

            // Only check gaps in front and sides (not behind batsman)
            if (y > 38) { // Only check if not behind wicket keeper
                let hasNearbyFielder = false;
                for (const player of this.players) {
                    if (player.role === 'fielder') {
                        const distance = Math.sqrt(
                            Math.pow(x - player.position.x, 2) +
                            Math.pow(y - player.position.y, 2)
                        );
                        if (distance < 12) {
                            hasNearbyFielder = true;
                            break;
                        }
                    }
                }

                if (!hasNearbyFielder) {
                    gaps.push({ x, y });
                }
            }
        }

        return gaps;
    }

    zoom(factor) {
        this.currentZoom = Math.max(50, Math.min(200, this.currentZoom * (factor / 100)));
        this.groundElement.style.transform = `scale(${this.currentZoom / 100})`;
        document.getElementById('zoomLevel').textContent = `${Math.round(this.currentZoom)}%`;
    }

    toggleSnapToGrid() {
        this.snapToGrid = !this.snapToGrid;
        const btn = document.getElementById('snapToGridBtn');
        btn.textContent = this.snapToGrid ? 'Grid: ON' : 'Snap to Grid';
        btn.style.backgroundColor = this.snapToGrid ? 'var(--color-success)' : '';
    }

    handleKeyboard(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 's':
                    e.preventDefault();
                    this.showSaveModal();
                    break;
                case 'z':
                    e.preventDefault();
                    this.resetField();
                    break;
                case 'e':
                    e.preventDefault();
                    this.exportField();
                    break;
            }
        }
        
        if (e.key === 'Escape') {
            this.hideSaveModal();
            this.hidePlayerEditModal();
            this.hideFieldMap();
            document.querySelectorAll('.coverage-overlay, .gaps-overlay, .restrictions-overlay')
                .forEach(overlay => overlay.classList.remove('active'));
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '8px';
        notification.style.color = 'white';
        notification.style.fontWeight = '500';
        notification.style.zIndex = '10001';
        notification.style.transform = 'translateX(400px)';
        notification.style.transition = 'transform 0.3s ease';
        notification.textContent = message;

        switch (type) {
            case 'success':
                notification.style.backgroundColor = 'var(--color-success)';
                break;
            case 'error':
                notification.style.backgroundColor = 'var(--color-error)';
                break;
            case 'warning':
                notification.style.backgroundColor = 'var(--color-warning)';
                break;
            default:
                notification.style.backgroundColor = 'var(--color-info)';
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Theme management
    initializeTheme() {
        // Check for saved theme preference or default to light
        const savedTheme = localStorage.getItem('cricketFieldTheme') || 'light';
        this.currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('cricketFieldTheme', this.currentTheme);
        this.updateThemeIcon();
        this.showNotification(`Switched to ${this.currentTheme} theme`, 'success');
    }

    updateThemeIcon() {
        const icon = this.themeToggleBtn?.querySelector('.theme-icon');
        if (icon) {
            icon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
            this.themeToggleBtn.setAttribute('aria-label',
                `Switch to ${this.currentTheme === 'light' ? 'dark' : 'light'} theme`);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CricketFieldPlanner();
});
