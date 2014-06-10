<?php

namespace PerfectIn\Ui\Service;

use TYPO3\Flow\Annotations as Flow;

class PresentationService extends \TYPO3\Flow\Cli\CommandController {
	

	/**
	 * @var \TYPO3\Flow\Package\PackageManagerInterface
	 * @Flow\Inject
	 */
	protected $packageManager;

	/**
	 * @var \TYPO3\Flow\Configuration\Source\YamlSource
	 * @Flow\Inject
	 */
	protected $yamlSource;
	
	/**
	 * @Flow\Inject
	 * @var \TYPO3\Flow\Resource\Publishing\ResourcePublishingTargetInterface
	 */
	protected $resourcePublishingTarget;
	
	/**
	 * @var array
	 */
	protected $settings;
	
	/**
	 * inject settings
	 * @param array $settings
	 */
	public function injectSettings($settings) {
		$this->settings = $settings;
	}
	
	/**
	 * get yaml configurations
	 *
	 * @return array
	 */
	public function getYamlConfigurations() {
		$package = $this->packageManager->getPackage('PerfectIn.Ui');
		return $this->yamlSource->load($package->getConfigurationPath() . 'Presentations');
	}
	
	/**
	 * get yamlconfiguration
	 * 
	 * @param string $name
	 * @return array
	 */
	public function getYamlConfiguration($name) {
		$presentations 		= $this->getYamlConfigurations();
		return $presentations[$name];
	}
	
	/**
	 * create yaml
	 *
	 * @param string $module
	 * @param string $name
	 * @return void
	 */
	public function createPresentation($module, $name) {
		$package 			= $this->packageManager->getPackage('PerfectIn.Ui');
		$identifier			= $module . '-' . $name;
		$moduleIdentifier	= 'perfectIn.ui.presentation.'.$module;
		$staticResourcesUri = '/'. $this->resourcePublishingTarget->getStaticResourcesWebBaseUri() . 'Packages/PerfectIn.Ui/Presentation/'.ucfirst($module).'/';
		
		/** create module **/
		$moduleDir = $package->getResourcesPath() . 'Public/Presentation/'.ucfirst($module).'/';
		\TYPO3\Flow\Utility\Files::createDirectoryRecursively($moduleDir);
		if (!file_exists($moduleDir . 'module.js')) {
			file_put_contents($moduleDir . 'module.js', 'angular.module(\'' . $moduleIdentifier . '\', []);');
		}
		
		/** create default template **/
		$templateDir = $moduleDir .'Templates/';
		\TYPO3\Flow\Utility\Files::createDirectoryRecursively($templateDir);
		file_put_contents($templateDir . ucfirst($name).'.html', '');
		
		/** create yaml **/
		$presentations 		= $this->getYamlConfigurations();
		$presentations[$identifier] = array(
			'name' => $identifier,
			'template' => $staticResourcesUri. 'Templates/'.ucfirst($name).'.html',
			'modules' => array($moduleIdentifier),
			'scripts' => array(
				$staticResourcesUri . 'module.js'
			)
		);	
		$this->yamlSource->save($package->getConfigurationPath() . 'Presentations', $presentations);		
	}
	
	/**
	 * create api
	 *
	 * @return string
	 */
	public function createApi() {
		require_once(FLOW_PATH_PACKAGES . 'Libraries/autoload.php');
		$apiFiles = $this->settings['Api']['files'];
		$apiLocation = $this->settings['Api']['location'];
		$apiFilesAsMinifyResources = array();
		
		foreach ($apiFiles AS $apiFile) {
			$apiFilesAsMinifyResources[] = new \Minify_Source(array('filepath' => $apiFile));
		}
		
		$apiContent = \Minify::combine($apiFilesAsMinifyResources);
		\TYPO3\Flow\Utility\Files::createDirectoryRecursively(dirname($apiLocation));
		file_put_contents($apiLocation, $apiContent);
		return $apiLocation;
	}
}